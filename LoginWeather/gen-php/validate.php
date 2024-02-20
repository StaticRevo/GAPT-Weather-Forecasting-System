<?php
// Citation: validations got from lecture resources (Shelter example) and adapted for use
    function validateName($formvalues, $validations){ 
        // check name
        if (!empty($formvalues['name'])) {
            ;
        }
        else
        {
            $nameErr = "Name is required";
            $validations['nameError'] = $nameErr;
        }
        
        return [$formvalues, $validations];
    }
    function validateSurname($formvalues, $validations){
        // check surname
        if (!empty($formvalues['surname'])) {
            ;
        }
        else
        {
            $surnameErr = "Surname is required";
            $validations['surnameError'] = $surnameErr;
        }
        
        return [$formvalues, $validations];
    }
    function validateEmail($formvalues, $validations){
        // Check email field
        if (!empty($formvalues["email"])) {
//            $email = clean_input($_POST["email"]); // already called function
            //FILTER_VALIDATE_EMAIL is one of many validation filters: https://www.php.net/manual/en/filter.filters.validate.php
            if (!filter_var($formvalues["email"], FILTER_VALIDATE_EMAIL))
            {
                $emailErr= 'You did not enter a valid email.';
                $validations['emailError'] = $emailErr;
            }
        }
        else
        {
            $emailErr = "Email is required";
            $validations['emailError'] = $emailErr;
        }
        
        return [$formvalues, $validations];
    }
    function validateMobile($formvalues, $validations){
        // check mobile
        if (!empty($formvalues['mobile'])) {
            if (!is_numeric($formvalues['mobile'])){
                $validations['mobileError'] = 'You did not enter a number.';
            } else
            if ((strlen((string) ($formvalues['mobile'])) != 8)){ // on the assumption of acepting Maltese phone numbers only.
                $validations['mobileError'] = 'You did not enter a valid Malta mobile number (consisting of 8 digits).';
            }
        }
        else
        {
            $validations['mobileError'] = "Mobile is required";
        }
        
        return [$formvalues, $validations];
    }
    function validateString($formvalues, $validations, $varName){ // generic function to a validate (check if set) a string, since it is required
        if (!empty($formvalues[$varName])) {
            ;
        }
        else
        {
            $err = "This field is required";
            
            $tmp = $varName.'Error';
            $validations[$tmp] = $err;
        }
        
        return [$formvalues, $validations];
    }
?>