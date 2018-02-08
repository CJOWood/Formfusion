/* Copyright (C) 2018 Chris Wood (chris@chriswood.org)
 * This file is part of FormFusion.
 * 
 * FormFusion is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * FormFusion is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
var ADDON_TITLE = "FormFusion";
var NOTICE = "";

var DEBUG = true;
var Settings = new Config();

//PropertiesService.getDocumentProperties().deleteAllProperties();
function onOpen(e) {
  initializeConfig();
  FormApp.getUi()
  .createMenu('FormFusion')
  .addItem("Initialize Config", "initializeConfig")
  .addItem("Populate Config", "populateConfig")
  .addItem("Check Config", "showConfig")
  .addItem("Delete Config", "deleteConfig")
  .addToUi();
}

function populateConfig(){
  log("Populating config with testing data...");
  Settings.PDF.save(true);
  Settings.PDF.name("TestPDF");
  Settings.PDF.email(false);
  Settings.PDF.location(""); //Drive Folder ID
  
  Settings.DOC.save(true);
  Settings.DOC.name("TestDOC");
  Settings.DOC.email(false);
  Settings.DOC.location(""); //Drive Folder ID
  
  Settings.FORM.markers([]);
  
  Settings.TEMPLATE.id(""); //Template Doc Id
  Settings.TEMPLATE.markers(["Last Name", "First Name"]);
  
  Settings.isSetup(true);
}

function showConfig(){
  try{
    FormApp.getUi().alert("Config:" + JSON.stringify(Settings) + "\n" +
      "PDF:" + JSON.stringify(Settings.PDF) + "\n" +
        "PDF.save:" + JSON.stringify(Settings.PDF.save()) + "\n" +
          "PDF.name:" + JSON.stringify(Settings.PDF.name()) + "\n" +
            "PDF.email:" + JSON.stringify(Settings.PDF.email()) + "\n" +
              "DOC:" + JSON.stringify(Settings.DOC) + "\n" +
                "FORM:" + JSON.stringify(Settings.FORM) + "\n" +
                  "TEMPLATE:" + JSON.stringify(Settings.TEMPLATE)); 
  }catch(e){log("showConfig Error: " + e)}
}

function initializeConfig(){
  log("initializing Config...");
  Settings = new Config();
  log("Config Initialized!");
}

function deleteConfig(){
  PropertiesService.getDocumentProperties().deleteAllProperties();
  //Settings = new Config();
  log("CONFIG DELETED");
  FormApp.getUi().alert("Config Deleted");
}

function onInstall(e){
  log("onInstall running...");
  //Setup stuff
  onOpen(e); 
  //maybe mark Settings.isStarted() as false??
}

function onFormSubmit(e) {
  try{
    if(!Settings.isSetup()){return} //If not setup dont do anything.
  }catch(e){
    log("Settings issue: " + e); 
  }
  
  log("Form Submitted... Getting template: " + Settings.TEMPLATE.id());
  
  //Get the template document.
  var template = DriveApp.getFileById(Settings.TEMPLATE.id());
  
  //Get the form response object
  var formResponse = e.response;
  
  log("Getting answers.");
  //Get the items (questions) from the response object
  var answers = formResponse.getItemResponses();
  
  log("Creating document from template.: " + Settings.DOC.name());
  //This makes a copy of the template and gets the new doc's id.
  var documentId = template.makeCopy(Settings.DOC.name(), Settings.DOC.location()).getId();
  //This opens the new document
  var document = DocumentApp.openById(documentId);
  //This get the body of the document where we will look for values to replace.
  var documentBody = document.getBody();  
  
  log("Replacing markers with answers: " + answers);
  //This is where we go thorugh the list of markers and try to find them in the document body to replace with the question answers.
  for(var i = 0; i < answers.length; i++){
    var answer = answers[i];
    var answerTitle = answer.getItem().getTitle(); 
    
    var replacedMarkerElements = [];
    
    if(inArray(answerTitle, Settings.TEMPLATE.markers())){
      //Marker is in the template => replace marker with question answer.
      //FUTURE: Check question type and make adjustments.
      try{
        var element = documentBody.replaceText("<<"+answerTitle+">>", answer.getResponse());
      }catch(e){
        log("Couldn't replace a Marker! " + e);
      }
        replacedMarkerElements.push(element);
      
    } else {
      //Couldn't find marker in the list of answer titles
      //TODO Report error to the user! Maybe by email?
      log("Couldn't find answer title '" + answerTitle + "' in list of MARKERS.");
    }
  }
  log("Markers replaced.");
  //So we have a document and all the markers have been replaced with answers from the form...
  
  log("Checking if savePDF:" + Settings.PDF.save());
  //Now lets check if we want to generate a PDF
  if(Settings.PDF.save()){
    log("Saving PDF");
    //document must be saved and closed before we can make a PDF from it.
    document.saveAndClose();
    
    //generate and save the pdf.
    var pdfBlob = document.getAs('application/pdf');
    pdfBlob.setName(Settings.PDF.name());
    Settings.PDF.location().createFile(pdfBlob);
  }
  
  log("Checking if saveDocument: " + Settings.DOC.save());
  //Now check if we DO NOT want to save the document
  if(!Settings.DOC.save()){
    log("Deleting document");
    //delete it.
    document.trashed(true);
  }
  
  
  log("----DOCFILLER COMPLETED SUCESSFULLY----");
}





