{
    let jobRoleField;
    let otherJobRoleField;

    let tShirtColorSelectContainer;
    let tShirtDesignSelect;     
    let tShirtColorSelect; 
    let tShirtColorSelectOptions = [];

    let activitiesFieldset;
    let activityCheckboxes;
    let activityPriceAmount;

    //Initial setup to run on DOM load
    function init(){

        //Focus the firt text field on load
        document.querySelector('input[type="text"]').focus();

        addJobRoleFunctionality();        
        addTshirtFunctionality();
        addActivitiesFunctionality();
    };

    //Job Role logic
    function addJobRoleFunctionality(){

        //Cache relevant DOM elements
        jobRoleSelect = document.querySelector("#title");

        /* Hide the Other job role field by default */
        otherJobRoleField = document.querySelector("#other-title");
        otherJobRoleField.style.display = "none";        

        //Handle Job Role selection
        jobRoleSelect.addEventListener("change", handleJobRoleSelection);
    }

    function handleJobRoleSelection(event){
        if(jobRoleSelect.value === "other") {
            otherJobRoleField.style.display = "block";
        }else{
            otherJobRoleField.style.display = "none";
        }
    }
    
    //T-shirt logic
    function addTshirtFunctionality(){
        //Cache relevant DOM elements
        tShirtDesignSelect = document.querySelector("#design");
        tShirtColorSelectContainer = document.querySelector("#colors-js-puns");
        tShirtColorSelect = tShirtColorSelectContainer.querySelector("#color");  

        //Create an array of all options in the Color dropdown
        for(let i = 0; i < tShirtColorSelect.childElementCount; i++){
            tShirtColorSelectOptions[tShirtColorSelect[i].value] = tShirtColorSelect[i].outerHTML;
        }
        //Handle design selection
        tShirtDesignSelect.addEventListener("change", handleTshirtDesignSelection);
        //Hide the color options until the design is selected
        tShirtColorSelectContainer.style.display = "none";
    }
    
    function handleTshirtDesignSelection(event){

        //Make color selection visible and add approptiate color options if a design was selected
        if(tShirtDesignSelect.value === "js puns") {

            tShirtColorSelectContainer.style.display = "block";

            tShirtColorSelect.innerHTML = tShirtColorSelectOptions["cornflowerblue"] + 
                                          tShirtColorSelectOptions["darkslategrey"] + 
                                          tShirtColorSelectOptions["gold"];
            
        }else if(tShirtDesignSelect.value === "heart js"){

            tShirtColorSelectContainer.style.display = "block";
            
            tShirtColorSelect.innerHTML = tShirtColorSelectOptions["tomato"] + 
                                          tShirtColorSelectOptions["steelblue"] + 
                                          tShirtColorSelectOptions["dimgrey"];
        }else{
            //Hide color selection if the design dropdown if back to default state 
            tShirtColorSelectContainer.style.display = "none";
        }
    }

    //Activities logic
    function addActivitiesFunctionality(){
        //Cache relevant DOM elements
        activitiesFieldset = document.querySelector(".activities");
        activityCheckboxes =  activitiesFieldset.querySelectorAll("label > input");

        //Create an element to show total activity price
        const activityPriceContainer = document.createElement("DIV");
        activitiesFieldset.appendChild(activityPriceContainer);
        activityPriceContainer.innerHTML = 'Total: $<span id="total-price">0</span>';
        activityPriceAmount = activityPriceContainer.querySelector("#total-price");

        let activityLabels = activitiesFieldset.querySelectorAll("label"); 

        for(let i = 0; i < activityLabels.length; i++){
            let activityLabel = activityLabels[i];
            let activityCheckbox = activityLabel.firstChild;
            let activityLabelText = activityLabel.textContent;
                    
            //Parse checkbox label text for relevant pieces of event informtion and save them in the checkbox's data property
            let price = activityLabelText.substring(activityLabelText.indexOf("$") + 1, activityLabelText.length);
            activityCheckbox.dataset.price = price;
            
            //Events other than the main conference have day and time info in the label text so extract these
            if(i > 0){
                let day = activityLabelText.substring(activityLabelText.indexOf("— ") + 2, activityLabelText.indexOf("y") + 1);
                let time = activityLabelText.substring(activityLabelText.indexOf("day ") + 4, activityLabelText.indexOf(", "));
                
                activityCheckbox.dataset.day = day;
                activityCheckbox.dataset.time = time;
            }        
        }
        //Handle selection/deselection of activity
        activitiesFieldset.addEventListener("change", handleActivityCheck);
    }

    function handleActivityCheck(event){      

        if(event.target.type.toLowerCase() === "checkbox"){

            let clickedCheckbox = event.target;
            let price = clickedCheckbox.dataset.price;
            let day = clickedCheckbox.dataset.day || ""; 
            let time = clickedCheckbox.dataset.time || "";

            let totalPrice = 0;   

            //Loop through all checkboxes...
            for (let i = 0; i < activityCheckboxes.length; i++){

                //Ensure the checkbox in the current loop iteration is not the checkbox that was clicked
                if(clickedCheckbox !== activityCheckboxes[i]){

                    //Check if the checkbox in the current loop iteration represents a conflicting activity (same date and time)
                    if(clickedCheckbox.dataset.day === activityCheckboxes[i].dataset.day && 
                        clickedCheckbox.dataset.time === activityCheckboxes[i].dataset.time
                    ){
                        //Depending on wheter the clicked checkbox was checked or unchecked, diable or re-enable conflicting activities
                        if(clickedCheckbox.checked){
                            activityCheckboxes[i].disabled = true;
                            activityCheckboxes[i].parentElement.style.opacity = .4;

                        }else{
                            activityCheckboxes[i].disabled = false;
                            activityCheckboxes[i].parentElement.style.opacity = 1;
                        }
                    }
                }

                //Add up all checked activities and display the total
                if(activityCheckboxes[i].checked){
                    totalPrice += parseInt(activityCheckboxes[i].dataset.price, 10);
                }                
            }

            activityPriceAmount.innerHTML = totalPrice;
        }
    }


    //Run the initial setup when the DOM is ready
    document.addEventListener("DOMContentLoaded", function(event) {
        init();
    });

};