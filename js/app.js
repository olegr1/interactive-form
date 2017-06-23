{
    let form;
    let basicInfoFieldset;
    let nameField;
    let emailField;

    let jobRoleField;
    let otherJobRoleField;

    let tShirtColorSelectContainer;
    let tShirtDesignSelect;     
    let tShirtColorSelect; 
    let tShirtColorSelectOptions = [];

    let activitiesFieldset;
    let activityCheckboxes;
    let activityPriceAmount;

    let paymentFieldset;
    let paymentSelect;
    let paymentCreditCardSection;
    let paymentPaypalSection;
    let paymentNotSelectedMessage;
    let paymentBitcoinSection;
    let creaditCardNumberField;
    let zipField;
    let cvvField;

    let submitButton;

    let validElements = {
        name: false,
        email: false,
        activities: false,
        paymentMethod: false,
        paymentCardNumber: false,
        paymentZip: false,
        paymentCvv: false
    }

    //Initial setup to run on DOM load
    function init(){
        //Cache DOM element references
        form = document.querySelector("form");
        basicInfoFieldset = form.querySelector("form > fieldset");
        nameField = document.querySelector("#name");
        emailField = document.querySelector("#mail");
        jobRoleSelect = document.querySelector("#title");

        tShirtDesignSelect = document.querySelector("#design");
        tShirtColorSelectContainer = document.querySelector("#colors-js-puns");
        tShirtColorSelect = tShirtColorSelectContainer.querySelector("#color"); 

        activitiesFieldset = document.querySelector(".activities");
        activityCheckboxes =  activitiesFieldset.querySelectorAll("label > input");

        paymentFieldset =  document.querySelectorAll("form > fieldset")[3];
        paymentSelect = document.querySelector("#payment");
        paymentCreditCardSection = document.querySelector("#credit-card");
        paymentPaypalSection = paymentCreditCardSection.nextElementSibling;
        paymentBitcoinSection = paymentPaypalSection.nextElementSibling; 

        paymentNotSelectedMessage = document.createElement("DIV");
        paymentNotSelectedMessage.innerHTML = '<span style="color: red; font-size: 15px; margin-bottom: 5px; margin-top: 5px;">' +
                                              'Please select a payment method!' +
                                              '</span>';    
        paymentFieldset.appendChild(paymentNotSelectedMessage);



        //Focus the firt text field on load
        document.querySelector('input[type="text"]').focus();

        addBasicInfoFunctionality();
        addJobRoleFunctionality();        
        addTshirtFunctionality();
        addActivitiesFunctionality();
        addPaymentFunctionality();

        addValidation();

        form.addEventListener("submit", submitHandler);
    };

    function addBasicInfoFunctionality(){

    }

    //Job Role logic
    function addJobRoleFunctionality(){
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
        }
    }

    //Payment method selection logic
    function addPaymentFunctionality(){

        //Set the initial state
        paymentPaypalSection.style.display = "none";
        paymentBitcoinSection.style.display = "none";
        paymentSelect.value = "credit card";

        //Hanle payment method selection
        paymentSelect.addEventListener("change", handlePaymentMethodSelection);
    }

    function handlePaymentMethodSelection(event){

        //Hide/show appropriate payment info based on selection
        if(paymentSelect.value === "credit card"){

            paymentCreditCardSection.style.display = "block";
            paymentPaypalSection.style.display = "none";
            paymentBitcoinSection.style.display = "none";

        }else if(paymentSelect.value === "paypal"){

            paymentCreditCardSection.style.display = "none";
            paymentPaypalSection.style.display = "block";
            paymentBitcoinSection.style.display = "none";

        }else if(paymentSelect.value === "bitcoin"){

            paymentCreditCardSection.style.display = "none";
            paymentPaypalSection.style.display = "none";
            paymentBitcoinSection.style.display = "block";     
            
        }else{

            paymentCreditCardSection.style.display = "none";
            paymentPaypalSection.style.display = "none";
            paymentBitcoinSection.style.display = "none";     
        }
    }

    function addValidation(){
        const nameFieldErrorElement = document.createElement("DIV");
        nameFieldErrorElement.style.color = "red";
        nameFieldErrorElement.style.fontSize = "15px";
        nameFieldErrorElement.style.marginBottom = "15px";
        nameFieldErrorElement.style.marginTop = "-10px";
        basicInfoFieldset.insertBefore(nameFieldErrorElement, emailField.previousElementSibling);

        nameFieldErrorElement.innerText ="Name empty";

        const emailFieldErrorElement = nameFieldErrorElement.cloneNode(false);
        basicInfoFieldset.insertBefore(emailFieldErrorElement, jobRoleSelect.previousElementSibling);

        emailFieldErrorElement.innerText ="Email empty";

        const activityErrorElement = nameFieldErrorElement.cloneNode(false);
        activityErrorElement.textContent = "Please select at least one activity"
        activityErrorElement.style.marginBottom = "5px";
        activityErrorElement.style.marginTop = "10px";
        activitiesFieldset.appendChild(activityErrorElement);
        
    }

    function checkValidation(){
        for(let prop in validElements){

            submitButton = document.querySelector("button[type='submit']");
            submitButton.disabled = true;
            submitButton.style.opacity = .5;
            submitButton.style.cursor = "default";

            if(validElements[prop] === false){
                break;
            }

            submitButton.disabled = false;
            submitButton.style.opacity = 1;
            submitButton.style.cursor = "pointer";
        }
    }

    function submitHandler(event){

         for(let prop in validElements){

            console.log(prop + " : " + validElements[prop]); 

            if(validElements[prop] === false){
                event.preventDefault();                               
            }
        }
    }
    


    //Run the initial setup when the DOM is ready
    document.addEventListener("DOMContentLoaded", function(event) {
        init();
    });

};