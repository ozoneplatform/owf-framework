<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>Configuration</title>

        <!--[if lt IE 8]>
            <script type="text/javascript" src="../js/backbone/json2.js"></script>
        <![endif]-->

        <p:javascript data-main='../js/components/admin/applicationConfiguration/main' src='require-js' pathToRoot="../" />
        
        <script type="text/javascript">
        
        
            // jQuery.noConflict();
        
            // jQuery(function($){ 
            //     var $ = jQuery;
                
            //     $(".app_config_menu_item_franchise_store").click(function(){
            //         removeAllActiveClasses();
            //         $(this).addClass('app_config_menu_item_franchise_store_active');    
            //     }); 
                
            //     $(".app_config_menu_item_branding").click(function(){
            //         removeAllActiveClasses();
            //         $(this).addClass('app_config_menu_item_branding_active');   
            //     }); 

            //     $(".app_config_menu_item_scorecard").click(function(){
            //         removeAllActiveClasses();
            //         $(this).addClass('app_config_menu_item_scorecard_active');  
            //     });                     

            //     $(".app_config_menu_item_additional_config").click(function(){
            //         removeAllActiveClasses();
            //         $(this).addClass('app_config_menu_item_additional_config_active');  
            //     });     

            //     $(".app_config_menu_item_data_exchange").click(function(){
            //         removeAllActiveClasses();
            //         $(this).addClass('app_config_menu_item_data_exchange_active');  
            //     });     

            //     $(".app_config_menu_item_listing_management").click(function(){
            //         removeAllActiveClasses();
            //         $(this).addClass('app_config_menu_item_listing_management_active'); 
            //     });

            //     $(".app_config_menu_item_user_account_settings").click(function(){
            //         removeAllActiveClasses();
            //         $(this).addClass('app_config_menu_item_user_account_settings_active');
            //     });

            //     function removeAllActiveClasses(){
            //         $(".app_config_menu_item_franchise_store").removeClass("app_config_menu_item_franchise_store_active");
            //         $(".app_config_menu_item_branding").removeClass("app_config_menu_item_branding_active");
            //         $(".app_config_menu_item_scorecard").removeClass("app_config_menu_item_scorecard_active");
            //         $(".app_config_menu_item_additional_config").removeClass("app_config_menu_item_additional_config_active");
            //         $(".app_config_menu_item_data_exchange").removeClass("app_config_menu_item_data_exchange_active");
            //         $(".app_config_menu_item_listing_management").removeClass("app_config_menu_item_listing_management_active");
            //         $(".app_config_menu_item_user_account_settings").removeClass("app_config_menu_item_user_account_settings_active");
            //         // Handle page layout when menus with larger content display
            //     }                   
            // });
            


        
        </script>

        
    </head>
  
      <body>
        <div id="marketContentWrapper">
            <div class="body">  
                <!-- Start the menu here -->
                <div>                   
                    <br>
                    
                    <div class="app_config_menu">
                    
                        <div class="app_config_menu_item app_config_menu_item_branding app_config_menu_item_branding_active">
                            <a href="#/config/branding" class="app_config_menu_item_link">Branding</a>
                        </div>      
            
                        
                        <div class="app_config_menu_item app_config_menu_item_scorecard">
                            <a href="#/config/scorecard" class="app_config_menu_item_link">Scorecard</a>
                        </div>
                        
                        <div class="app_config_menu_item app_config_menu_item_listing_management">
                            <a href="#/config/listing_management" class="app_config_menu_item_link">Listing Management</a>
                        </div>
                        
                        <div class="app_config_menu_item app_config_menu_item_data_exchange">
                            <a href="#/config/data_exchange" class="app_config_menu_item_link">Data Exchange</a>
                        </div>
                        
                        <franchise:renderFranchiseStoreOnly>
                            <div class="app_config_menu_item app_config_menu_item_franchise_store">
                                <a href="#/config/franchise_affiliation" class="app_config_menu_item_link">Franchise Administration</a>
                            </div>
                        </franchise:renderFranchiseStoreOnly>
                                                
                        <div class="app_config_menu_item app_config_menu_item_additional_config">
                            <a href="#/config/additional_configuration" class="app_config_menu_item_link">Additional Configurations</a>
                        </div>

                        <div class="app_config_menu_item app_config_menu_item_user_account_settings">
                            <a href="#/config/user_account_settings" class="app_config_menu_item_link">User Account Settings</a>
                        </div>
                                
                    </div>                  
                </div>
                <!-- Start the page content here -->
                <div id="applicationConfigurationDetail" class="app_config_list_view_panel">
                        
                </div>          
            </div>
         </div>

  

</html>