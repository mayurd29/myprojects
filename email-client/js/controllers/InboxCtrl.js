angular.module('EmailApp')
  .controller('InboxCtrl',
    function InboxCtrl ( InboxFactory ) {
      'use strict';

     //  InboxFactory
     //  	.getMessages()
     //  		.success(function(data){ 
  			// 	console.log(data); 
  			// });

      this.title = "My Inbox";
      
    });