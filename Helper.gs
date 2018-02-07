/* Copyright (C) 2018 Chris Wood
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

function options() {
  var savePDF = function(){
    return OPTIONS.save_PDF;
  };
  var saveDocument = function(){
    return OPTIONS.save_Document;
  };
  var emailPDF = function(){
    return OPTIONS.email_PDF;
  };
  var pdfName = function(){
     //TODO if null name give it a defualt
    return PDF_NAME; 
  }
  var documentName = function(){
    
    //TODO if null name give it a defualt
    return DOCUMENT_NAME; 
  }
  var documentSaveLocation = function(){
    //Either get specified save location or the location of the template.
    try{
      return DOCUMENT_SAVE_LOCATION ? DriveApp.getFolderById(DOCUMENT_SAVE_LOCATION) : template.getParents().next();
    }catch(e){
      Logger.log(e);
    }
    
    //Try again to return template's folder otherwise just give it the root folder of the drive
    try{
      return template.getParents().next();
    }catch(e){
     Logger.log(e);
    }
    
    return DriveApp.getRootFolder();
  };
  var pdfSaveLocation = function(){
    //Either get specified save location or the location of the template.
    try{
      return PDF_SAVE_LOCATION ?  DriveApp.getFolderById(PDF_SAVE_LOCATION) : template.getParents().next();
    }catch(e){
      Logger.log(e);
    }
    
    //Try to return template's folder otherwise just give it the root folder of the drive
    try{
      return template.getParents().next();
    }catch(e){
     Logger.log(e);
    }
    
    return DriveApp.getRootFolder();
  };
  
  return {
    savePDF: savePDF(),
    saveDocument: saveDocument(),
    emailPDF: emailPDF(),
    pdfName: pdfName(),
    documentName: documentName(),
    documentSaveLocation: documentSaveLocation(),
    pdfSaveLocation: pdfSaveLocation()
  }
};

function inArray(value, array) {
  return array.indexOf(value) > -1;
}

function log(data){
  if(DEBUG){Logger.log(data)};
}

function showHelp(){
 log("Show help"); 
}
