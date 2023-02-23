sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("cis.ik12.controller.View1", {
            onInit: function () {

            },
            onAfterRendering: function(){
                this._fetchCSRFToken();
            },
            onPressSubmit: function(){
                let oIK12Data = this.getView().getModel("ik12Model").getData();
                let that = this;
                let sBasicAuthentication = btoa("ASSETMGR:Convergent123");
                var settings = {
                    "url": "/sap/opu/odata/MERP/SAP_SRV_ASSET_MANAGER_2205/MeasurementDocuments",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                      "sap-client": "001",
                      "x-csrf-token": that.token,
                      "Authorization": `Basic ${sBasicAuthentication}`,
                      "Content-Type": "application/json",
                    },
                    "data": JSON.stringify(oIK12Data),
                  };
                  
                  $.ajax(settings).done(function (response) {
                    console.log(response);
                  });

            },
            _fetchCSRFToken: function(){
                const appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                const appPath = appId.replaceAll(".", "/");
                this.appModulePath = jQuery.sap.getModulePath(appPath);
                let that= this;
                let sBasicAuthentication= btoa("ASSETMGR:Convergent123");
                $.ajax({
                    // url: this.appModulePath+"/BUSINESS_RULES/rest/v2/xsrf-token",
                    url:"/sap/opu/odata/MERP/SAP_SRV_ASSET_MANAGER_2205/MeasurementDocuments",
                    method: "GET",
                    async: false,
                    headers: {
                        "sap-client": "001",
                        "x-csrf-token": "fetch",
                        "Authorization": `Basic ${sBasicAuthentication}`
                      
                    },
                    success: function (result1, xhr1, data1) {
                     that.token= data1.getResponseHeader("x-csrf-token")
                    }
                });
            },

            formatDate: function(sDateString){
                if(sDateString){
                    let oDate =  new Date(parseInt(sDateString.split('(')[1].split(')')[0]));
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        format: "yMMMd"
                    });
                    
                   let oReturnDate = oDateFormat.format(oDate);
                   return oReturnDate;
                }
            },
            onChangeReadingDate: function(oEvent){
                let oIK12Data = this.getView().getModel("ik12Model").getData();
                let sTime = new Date(oEvent.getSource().getValue()).getTime();
                oIK12Data.ReadingDate = `/Date(${sTime})/`;
            },
            onChangeReadingTimestamp: function(oEvent){
                let oIK12Data = this.getView().getModel("ik12Model").getData();
                let sTime = new Date(oEvent.getSource().getValue()).getTime();
                oIK12Data.ReadingTimestamp = `/Date(${sTime})/`;
            },
            onChangeReadingTime: function(oEvent){
                let oIK12Data = this.getView().getModel("ik12Model").getData();
                let sTimeString = oEvent.getSource().getValue();
                let sHrs = sTimeString.split(':')[0];
                let sMins = sTimeString.split(':')[1];
                let sSecs = sTimeString.split(':')[2];
                sSecs = sSecs.substr(0,2);
                // PT18H39M25S
                oIK12Data.ReadingTime = `PT${sHrs}H${sMins}M${sSecs}S`;

            },

        });
    });
