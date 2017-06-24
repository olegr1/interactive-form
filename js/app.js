{
    //Define variables accessible to all functions
    let form;
    let submitButton;

    let nameField;
    let nameErrorMessageContainer;
    let emailField;
    let emailErrorMessageContainer;

    let activitiesFieldset;
    let activityCheckboxes;
    let activitiesErrorMessageContainer;

    let paymentSelect;
    let paymentSelectErrorMessageContainer;
    let creditCardNumberField;
    let creditCardNumberErrorMessageContainer;
    let zipField;
    let zipErrorMessageContainer;
    let cvvField;
    let cvvErrorMessageContainer;

    //Initial setup to run on DOM load
    function init(){    
        form = document.querySelector("form");  
        submitButton = form.querySelector("button[type='submit']");

        //Most of the functionality is defined inside separate functions to make the code more comprehensible
        addBasicInfoFunctionality();
        addTshirtFunctionality();
        addActivitiesFunctionality();
        addPaymentFunctionality();

        form.addEventListener("submit", submitHandler);
    };

    function addBasicInfoFunctionality(){
        const basicInfoFieldset = document.querySelectorAll("form > fieldset")[0];
        const legend = basicInfoFieldset.querySelector("legend");
        nameField = document.querySelector("#name");
        emailField = document.querySelector("#mail");

        //Focus the firt text field on load
        nameField.focus();        

        //Job Role logic
        const jobRoleSelect = document.querySelector("#title");
        const otherJobRoleField = document.querySelector("#other-title");

        /* Hide the Other job role field by default */        
        otherJobRoleField.style.display = "none";        

        //Handle Job Role selection
        jobRoleSelect.addEventListener("change", (event)=>{handleJobRoleSelection(event, jobRoleSelect, otherJobRoleField)});

        //Validation
        //Create error message containers
        emailErrorMessageContainer = document.createElement("DIV");
        emailErrorMessageContainer.className = "error";
        basicInfoFieldset.insertBefore(emailErrorMessageContainer, legend);

        nameErrorMessageContainer = document.createElement("DIV");
        nameErrorMessageContainer.className = "error";
        basicInfoFieldset.insertBefore(nameErrorMessageContainer, emailErrorMessageContainer);

        //Trigger validation on keyup event to provide real-time validation feedback
        nameField.addEventListener("keyup", (event)=>{
            //Tprevent forus from triggering this event
            if(event.key !== "F5"){
                validateTextField(nameField, "name", ["non-empty"], nameErrorMessageContainer);
            }
        });

        emailField.addEventListener("keyup", (event)=>{
            validateTextField(emailField, "email", ["non-empty", "email-format"], emailErrorMessageContainer);
        });
    }

    //Show Other job role field is the Other option is selected
    function handleJobRoleSelection(event, jobRoleSelect, otherJobRoleField){
        if(jobRoleSelect.value === "other") {
            otherJobRoleField.style.display = "block";
        }else{
            otherJobRoleField.style.display = "none";
        }
    }
    
    //T-shirt logic
    function addTshirtFunctionality(){
        const tShirtFieldset = document.querySelectorAll("form > fieldset")[1];
        const legend = tShirtFieldset.querySelector("legend");
        const tShirtColorSelectContainer = document.querySelector("#colors-js-puns");
        const tShirtDesignSelect = document.querySelector("#design");  
        const tShirtColorSelect = tShirtColorSelectContainer.querySelector("#color"); 
        const tShirtColorSelectOptions = [];

        //Create an array of all options in the Color dropdown
        for(let i = 0; i < tShirtColorSelect.childElementCount; i++){
            tShirtColorSelectOptions[tShirtColorSelect[i].value] = tShirtColorSelect[i].outerHTML;
        }
        //Handle design selection
        tShirtDesignSelect.addEventListener("change", (event)=>{handleTshirtDesignSelection(event, 
                                                                                            tShirtColorSelectContainer, 
                                                                                            tShirtDesignSelect,
                                                                                            tShirtColorSelect,
                                                                                            tShirtColorSelectOptions
                                                                                            )});
        //Hide the color options until the design is selected
        tShirtColorSelectContainer.style.display = "none";
    }
    
    function handleTshirtDesignSelection(event, tShirtColorSelectContainer, tShirtDesignSelect, tShirtColorSelect, tShirtColorSelectOptions){

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
        activitiesFieldset = document.querySelector(".activities");
        const legend = activitiesFieldset.querySelector("legend");        
        activityCheckboxes =  activitiesFieldset.querySelectorAll("label > input");

        //Create an element to show total activity price
        const activityPriceContainer = document.createElement("DIV");
        activitiesFieldset.appendChild(activityPriceContainer);
        activityPriceContainer.innerHTML = 'Total: $<span id="total-price">0</span>';
        const activityPriceAmount = activityPriceContainer.querySelector("#total-price");         

        let activityLabels = activitiesFieldset.querySelectorAll("label"); 

        for(let i = 0; i < activityLabels.length; i++){
            let activityLabel = activityLabels[i];
            let activityCheckbox = activityLabel.firstChild;
            let activityLabelText = activityLabel.textContent;
                    
            //Parse checkbox label text for relevant pieces of event informtion and save them in the checkbox's data property
            let price = activityLabelText.substring(activityLabelText.indexOf("$") + 1, activityLabelText.length);
            activityCheckbox.dataset.price = price;
            
            //Activities other than the main conference have day and time info in the label text so extract these
            if(i > 0){
                let day = activityLabelText.substring(activityLabelText.indexOf("— ") + 2, activityLabelText.indexOf("y") + 1);
                let time = activityLabelText.substring(activityLabelText.indexOf("day ") + 4, activityLabelText.indexOf(", "));
                
                activityCheckbox.dataset.day = day;
                activityCheckbox.dataset.time = time;
            }        
        }

        //Validation
        //Create error message containers
        activitiesErrorMessageContainer = document.createElement("DIV");
        activitiesErrorMessageContainer.className = "error";
        activitiesFieldset.insertBefore(activitiesErrorMessageContainer, legend);

        //Handle selection/deselection of activity
        activitiesFieldset.addEventListener("change", (event)=>{handleActivityCheck(event, 
                                                                                    activityCheckboxes, 
                                                                                    activityPriceAmount,
                                                                                    activitiesErrorMessageContainer
                                                                                    )}); 
    }

    //Make sure at least one activity is selected, otherwise display an error message
    function validateActivities(){

        let isValid = true;

        let selectedActivitiesCount = 0;
        activitiesErrorMessageContainer.innerHTML = "";

        for (let i = 0; i < activityCheckboxes.length; i++){                
            if(activityCheckboxes[i].checked){
                selectedActivitiesCount +=1;
            }
        }

        if(selectedActivitiesCount < 1){
            activitiesErrorMessageContainer.innerHTML = "please select one or more activities";
            isValid = false;
        }        

        return isValid;
    }

    function handleActivityCheck(event, activityCheckboxes, activityPriceAmount, activitiesErrorMessageContainer){      

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
                        //Depending on wheter the clicked checkbox became checked or unchecked, disable or re-enable conflicting activities
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

            validateActivities();
        }
    }

    //Payment method selection logic
    function addPaymentFunctionality(){

        const paymentFieldset =  document.querySelectorAll("form > fieldset")[3];
        const legend = paymentFieldset.querySelector("legend");
        
        paymentSelect = paymentFieldset.querySelector("#payment");
        const paymentCreditCardSection = paymentFieldset.querySelector("#credit-card");
        const paymentPaypalSection = paymentCreditCardSection.nextElementSibling;
        const paymentBitcoinSection = paymentPaypalSection.nextElementSibling; 
        
        creditCardNumberField = paymentFieldset.querySelector("#cc-num");
        zipField = paymentFieldset.querySelector("#zip");
        cvvField = paymentFieldset.querySelector("#cvv");

        //Set the initial state
        paymentPaypalSection.style.display = "none";
        paymentBitcoinSection.style.display = "none";
        paymentSelect.value = "credit card";

        //Hanle payment method selection
        paymentSelect.addEventListener("change", (event)=>{handlePaymentMethodSelection(paymentCreditCardSection,                                                                         
                                                                                        paymentPaypalSection,
                                                                                        paymentBitcoinSection
                                                                                        )});                                                                                        
        //Validation
        //Create error message containers
        cvvErrorMessageContainer = document.createElement("DIV");
        cvvErrorMessageContainer.className = "error";
        paymentFieldset.insertBefore(cvvErrorMessageContainer, legend);

        zipErrorMessageContainer = document.createElement("DIV");
        zipErrorMessageContainer.className = "error";
        paymentFieldset.insertBefore(zipErrorMessageContainer, cvvErrorMessageContainer);

        creditCardNumberErrorMessageContainer = document.createElement("DIV");
        creditCardNumberErrorMessageContainer.className = "error";
        paymentFieldset.insertBefore(creditCardNumberErrorMessageContainer, zipErrorMessageContainer);

        paymentSelectErrorMessageContainer = document.createElement("DIV");
        paymentSelectErrorMessageContainer.className = "error";
        paymentFieldset.insertBefore(paymentSelectErrorMessageContainer, creditCardNumberErrorMessageContainer);

        //Trigger validation on keyup event to provide real-time validation feedback
        cvvField.addEventListener("keyup", (event)=>{
            validateTextField(cvvField, "CVV", ["non-empty", "cvv"], cvvErrorMessageContainer);
        });

        zipField.addEventListener("keyup", (event)=>{
            validateTextField(zipField, "ZIP", ["non-empty", "zip"], zipErrorMessageContainer);
        });

        creditCardNumberField.addEventListener("keyup", (event)=>{
            validateTextField(creditCardNumberField, "credit card number", ["non-empty", "credit-card"], creditCardNumberErrorMessageContainer);
        });
    }

    //Make sure some payment method is selected    
    function validatePayment(){
      
        let isValid = true;

        if(paymentSelect.value === "select_method"){
            isValid = false;
        }      

        return isValid;
    }

    function handlePaymentMethodSelection(paymentCreditCardSection, 
                                          paymentPaypalSection,
                                          paymentBitcoinSection){

        //Hide/show appropriate payment info and error messages based on selection
        if(paymentSelect.value === "credit card"){

            paymentCreditCardSection.style.display = "block";
            paymentPaypalSection.style.display = "none";
            paymentBitcoinSection.style.display = "none";

            creditCardNumberErrorMessageContainer.style.display = "block";
            zipErrorMessageContainer.style.display = "block";
            cvvErrorMessageContainer.style.display = "block";  

        }else if(paymentSelect.value === "paypal"){

            paymentCreditCardSection.style.display = "none";
            paymentPaypalSection.style.display = "block";
            paymentBitcoinSection.style.display = "none";

            creditCardNumberErrorMessageContainer.style.display = "none";
            zipErrorMessageContainer.style.display = "none";
            cvvErrorMessageContainer.style.display = "none";  

        }else if(paymentSelect.value === "bitcoin"){

            paymentCreditCardSection.style.display = "none";
            paymentPaypalSection.style.display = "none";
            paymentBitcoinSection.style.display = "block";

            creditCardNumberErrorMessageContainer.style.display = "none";
            zipErrorMessageContainer.style.display = "none";
            cvvErrorMessageContainer.style.display = "none";  
            
        }else{

            paymentCreditCardSection.style.display = "none";
            paymentPaypalSection.style.display = "none";
            paymentBitcoinSection.style.display = "none";

            creditCardNumberErrorMessageContainer.style.display = "none";
            zipErrorMessageContainer.style.display = "none";
            cvvErrorMessageContainer.style.display = "none";   
        }
    }

    //Only allow the form to be submitted if it passed validation
    function submitHandler(event){

        //The functions return true or false depending on the validation status
        let validationChecklist = [
            validateTextField(nameField, "Name", ["non-empty"], nameErrorMessageContainer),
            validateTextField(emailField, "Email", ["non-empty", "email-format"], emailErrorMessageContainer),
            validateActivities(),
            validatePayment()
        ];

        //These need to be validated only if the payment method is set to credit card
        if(paymentSelect.value === "credit card"){
            validationChecklist = validationChecklist.concat([
                validateTextField(cvvField, "CVV", ["non-empty", "cvv"], cvvErrorMessageContainer),
                validateTextField(zipField, "ZIP", ["non-empty", "zip"], zipErrorMessageContainer),
                validateTextField(creditCardNumberField, "Credit card number", ["non-empty", "credit-card"], creditCardNumberErrorMessageContainer)
            ]);
        }   

        //Check if all the relevant fields are validated, otherwise prevent the form from submitting
        
        for(let i = 0; i < validationChecklist.length; i++){
            if(validationChecklist[i] === false){
                event.preventDefault();                                              
            }            
        }
    }

    //Validation helper function
    function validateTextField(field, fieldName, validateFor, errorMessageContainer){
        let error = "";
        let isValid = true;

        let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let cvvRegEx = /^[0-9]{3}$/;
        let zipRegEx = /^[0-9]{5}$/;
        let creditCardRegEx = /^\d( ?\d){12,15}$/;

        //console.log("validating: ",  validateFor)

        for(let i = 0; i < validateFor.length; i++) {

            if(validateFor[i] === "non-empty"){
                if(field.value.length === 0){
                    error += "• please enter a " + fieldName + "<br>";
                    isValid = false;
                }
            }  

            if(validateFor[i] === "email-format"){
                if(field.value.length > 0 && !field.value.match(emailRegEx)){
                    error += "• " + fieldName + " format is invalid<br>";
                    isValid = false;
                }
            }      
            
            if(validateFor[i] === "cvv"){
                if(field.value.length > 0 && !field.value.match(cvvRegEx)){
                    error += "• " + fieldName + " has to be 3 digits long<br>";
                    isValid = false;
                }
            } 

            if(validateFor[i] === "zip"){
                if(field.value.length > 0 && !field.value.match(zipRegEx)){
                    error += "• " + fieldName + " has to be 5 digits long<br>";
                    isValid = false;
                }
            }  

            if(validateFor[i] === "credit-card"){
                if(field.value.length > 0 && !field.value.match(creditCardRegEx)){
                    error += "• " + fieldName + " has to be between 13 and 16 digits long<br>";
                    isValid = false;
                }
            } 
        }        

        errorMessageContainer.innerHTML = error; 

        return isValid;
    }

    //Run the initial setup when the DOM is ready
    document.addEventListener("DOMContentLoaded", function(event) {
        init();
    });
};