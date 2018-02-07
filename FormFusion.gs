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

var ADDON_TITLE = "Formfusion";
var NOTICE = "";


/**
  *
  * USER-Defined settings.
  *
**/

//FORM/TEMPLATE SETTINGS:

//MARKERS is a list of question names that will be used to find and replace text in the template.
var MARKERS = [];

//This is the Id of the template to generate the document from the form.
var TEMPLATE_ID = "";

//Enter names for the document and PDF.
var DOCUMENT_NAME = "";
var PDF_NAME = ""; //excluding .pdf

//These are the locations (folders) that the PDF and Document will be saved in. If empty the default is the same folder as the template.
var DOCUMENT_SAVE_LOCATION = "";
var PDF_SAVE_LOCATION = "";

//Other settings:
var OPTIONS = {
  save_Document: true,
  save_PDF: true,
};


/**
  *
  * System-settings. Do not edit below this line.
  *
**/
var template;
var DEBUG = true;
Logger.log("Debug? " + DEBUG);

function onOpen() {
  log("Setup Menu");
  FormApp.getUi()
      .createMenu('FormFusion')
  .addItem("Help", "showHelp")
      .addToUi();
}

function onFormSubmit(e) {
  log("Form Submitted.");
  
  //Get the template document.
  template = DriveApp.getFileById(TEMPLATE_ID);
  
  //Get the Settings
  settings = options();
  log(settings);
  
  //Get the form response object
  var formResponse = e.response;
  
  log("Getting answers.");
  //Get the items (questions) from the response object
  var answers = formResponse.getItemResponses();
  
  log("Creating document from template.: " + settings.documentName);
  //This makes a copy of the template and gets the new doc's id.
  var documentId = template.makeCopy(settings.documentName, settings.documentSaveLocation).getId();
  //This opens the new document
  var document = DocumentApp.openById(documentId);
  //This get the body of the document where we will look for values to replace.
  var documentBody = document.getBody();  
  
  log("Replacing markers with answers: " + answers);
  //This is where we go through the list of markers and try to find them in the document body to replace with the question answers.
  for(var i = 0; i < answers.length; i++){
    var answer = answers[i];
    var answerTitle = answer.getItem().getTitle(); 
    
    var replacedMarkerElements = [];
    
    if(inArray(answerTitle, MARKERS)){
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
      Logger.log("Couldn't find answer title '" + answerTitle + "' in list of MARKERS.");
    }
  }
  log("Markers replaced.");
  //So we have a document and all the markers have been replaced with answers from the form...
  
  log("Checking if savePDF:" + settings.savePDF);
  //Now lets check if we want to generate a PDF
  if(settings.savePDF){
    log("Saving PDF");
    //document must be saved and closed before we can make a PDF from it.
    document.saveAndClose();
    
    //generate and save the pdf.
    var pdfBlob = document.getAs('application/pdf');
    pdfBlob.setName(settings.pdfName);
    settings.pdfSaveLocation.createFile(pdfBlob);
  }
  
  log("Checking if saveDocument: " + settings.saveDocument);
  //Now check if we DO NOT want to save the document
  if(!settings.saveDocument){
    log("Deleting document");
    //delete it.
    document.trashed(true);
  }
  
  
  log("----FormFusion COMPLETED SUCESSFULLY----");
}



