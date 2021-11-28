<?php

if(isset($_FILES["file"]["name"])){
    $file_name = $_FILES["file"]["name"]; 


    //TODO : CHECK EXTENSION 
    if(move_uploaded_file($_FILES["file"]["tmp_name"], "upload/$file_name")){
        echo $file_name;
    }else{
        echo "fail";

    }
    

}
else{
    echo "fail";
}

