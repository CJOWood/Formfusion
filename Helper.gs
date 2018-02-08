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

function Config() {
  var documentProperties = PropertiesService.getDocumentProperties();
  var userProperties = PropertiesService.getUserProperties();
  var devProperties = PropertiesService.getScriptProperties();

  //If config is not setup use defaults...
  setupDefaults({
    config: {
      isSetup: false
    },
    pdf: {
      name: "",
      location: "",
      save: false,
      email: false
    },
    doc: {
      name: "",
      location: "",
      save: false,
      email: false
    },
    form: {
      markers: null
    },
    template: {
      id: "",
      markers: null
    }
    });
  
  var configSettings = getProp("document", "config");
  
  this.PDF = new pdf();
  this.DOC = new document();
  this.FORM = new form();
  this.TEMPLATE = new template();

  this.isSetup = function(arg){
    if(!arg){
      return configSettings.isSetup;
    }else{
      configSettings.isSetup = arg;
      setProp("document", "config", configSettings);
    }
  };
  
  function form(){
    var propType = "document";
    var key = "form";
    var formSettings = getProp(propType, key);
    
    this.markers = function(arg){
      if(!arg){
        return formSettings.markers;
      }else{
        formSettings.markers = arg;
        updateProp();
      }
    }
    
    function updateProp(){
      setProp(propType, key, formSettings);
    }
  }
  
  function template(){
    var propType = "document";
    var key = "template";
    var formSettings = getProp(propType, key);
    
    this.id = function(arg){
      if(!arg){
        return formSettings.id;
      }else{
        formSettings.id = arg;
        updateProp();
      }
    }
    
    this.markers = function(arg){
      if(!arg){
        return formSettings.markers;
      }else{
        formSettings.markers = arg;
        updateProp();
      }
    }
    
    function updateProp(){
      setProp(propType, key, formSettings);
    }
  }
  
  function pdf(){
    var propType = "document";
    var key = "pdf";
    var pdfSettings = getProp(propType, key);
    
    this.save = function save(arg){
      if(!arg){
        return pdfSettings.save;
      }else{
        pdfSettings.save = arg;
        updateProp();
      } 
    }
    
    this.location = function(arg){
      if(!arg){
        var location = pdfSettings.location;
        return location ? DriveApp.getFolderById(location) : DriveApp.getRootFolder();
      }else{
        pdfSettings.location = arg;
        updateProp();
      } 
    }
    
    this.email = function(arg){
      if(!arg){
        return pdfSettings.email;
      }else{
        pdfSettings.email = arg;
        updateProp();
      } 
    }
    
    this.name = function(arg){
      if(!arg){
        return pdfSettings.name;
      }else{
        pdfSettings.name = arg;
        updateProp();
      } 
    }
    
    function updateProp(){
      setProp(propType, key, pdfSettings);
    }
  }
  
  function document(){
    var propType = "document";
    var key = "doc";
    var documentSettings = getProp(propType, key);
    
    this.save = function save(arg){
      if(!arg){
        return documentSettings.save;
      }else{
        documentSettings.save = arg;
        updateProp();
      } 
    }
    
    this.location = function(arg){
      if(!arg){
        var location = documentSettings.location;
        return location ? DriveApp.getFolderById(location) : DriveApp.getRootFolder();
      }else{
        documentSettings.location = arg;
        updateProp();
      } 
    }
    
    this.email = function(arg){
      if(!arg){
        return documentSettings.email;
      }else{
        documentSettings.email = arg;
        updateProp();
      } 
    }
    
    this.name = function(arg){
      if(!arg){
        return documentSettings.name;
      }else{
        documentSettings.name = arg;
        updateProp();
      } 
    }
    
    function updateProp(){
      setProp(propType, key, documentSettings);
    }
  }
  
  function email(){
    var propType = "document";
    var key = "email";
    var formSettings = getProp(propType, key);
    
    function updateProp(){
      setProp(propType, key, formSettings);
    }
  }
  
  function getProp(prop, key){
    try{
      switch(prop){
        case "document":
          return JSON.parse(documentProperties.getProperty(key));
        case "user":
          return JSON.parse(userProperties.getProperty(key));
        case "dev":
          return JSON.parse(devProperties.getProperty(key));
        default:
          return "Can not find key: " + key;
      }
    }catch(e){
      log("getProp Error: " + e);
      throw new e;
    }
    
  }
  
  function setProp(prop, key, val){
    try{
      switch(prop){
        case "document":
          documentProperties.setProperty(key, JSON.stringify(val));
          break;
        case "user":
          userProperties.setProperty(key, JSON.stringify(val));
          break;
        case "dev":
          devProperties.setProperty(key, JSON.stringify(val));
          break;
        default:
          //TODO Throw error?
          return "Can not find key: " + key;
      }
    }catch(e){
      log("setProp Error: " + e);
      throw new e;
    }
  }
  
  function setupDefaults(defaults){
    if(!documentProperties.getKeys())
    {
      log("Setting defaults...");
      for (var prop in defaults) {
        defaults[prop] = JSON.stringify(defaults[prop]);
      }
      
      documentProperties.setProperties(defaults);
    }
  }
}

function inArray(value, array) {
  return array.indexOf(value) > -1;
}

function log(data){
  if(DEBUG){Logger.log(data)};
}
