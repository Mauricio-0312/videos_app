<?php

namespace App\Services;
use App\Entity\User;
use Firebase\JWT\JWT;

class Jwt_auth{
    
    public $manager;
    public $key;
    
    public function __construct($manager) {
        $this->manager = $manager;
        $this->key = "This_is_my_key12345654234523424309";
    }
    public function signup($email, $password, $getToken = null){
        //Check if user exists 
        $user = $this->manager->getRepository(User::class)->findOneBy([
            "email" => $email,
            "password" => $password,
        ]);
        
        if(is_object($user)){
            $token = [
               "sub" => $user->getId(), 
               "name" => $user->getName(),
               "surname" => $user->getSurname(),
               "email" => $user->getEmail(),
               "iat" => time(),
               "exp" => time() + (7 * 24 * 60 * 60)
            ];
            
            $encodedToken = JWT::encode($token, $this->key, "HS256");
            $decodedToken = JWT::decode($encodedToken, $this->key, ["HS256"]);

            if(!empty($getToken)){
                $data = $encodedToken;
            }else{
                $data = $decodedToken;
            }
        }else{
            $data = [
                "status" => "error",
                "code" => 400 ,
                "message" => "El usuario no existe"
            ];
        }
        
        return $data;
    }
    
    public function checkToken($token, $identity = false) {
        $auth = false;

        try{
            $jwt = str_replace('"', '', $token);
            $decodedToken = JWT::decode($jwt, $this->key, ["HS256"]);
        }
        catch(\UnexpectedValueException $e){
            $auth = false;

        }
        catch(\DomainException $e){
            $auth = false;

        }
        if(isset($decodedToken) && is_object($decodedToken) && isset($decodedToken->sub)){
            if($decodedToken->exp < time()){
                $auth = false;
            }else{
               $auth = true;
            }
            
          
        }else{
            $auth = false;
        }
        
        if($identity){
            return $decodedToken;
        }else{
            return $auth;
        }
        
    }
}

