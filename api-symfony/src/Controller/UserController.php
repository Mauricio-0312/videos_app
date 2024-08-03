<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\Email;
use App\Entity\User;
use App\Entity\Video;
use App\Services\Jwt_auth;

class UserController extends AbstractController
{
    private function resjson($data){
        //Serialize data with the serializer service
        $json = $this->get("serializer")->serialize($data, "json");

        //Response with HttpFoundation
        $response = new Response();

        //Assign content to the response
        $response->setContent($json);

        //Response format
        $response->headers->set("Content-Type", "application/json");

        //Return response
        return $response;
    }

    public function index(): Response
    {
        $userRepo = $this->getDoctrine()->getRepository(User::class);
        $videoRepo = $this->getDoctrine()->getRepository(Video::class);

        $users = $userRepo->findAll();
        $user = $userRepo->find(1);
        $video = $videoRepo->find(1);
        $videos = $videoRepo->findAll();

        /*foreach($users as $user){
            echo "<h1>{$user->getName()} {$user->getSurname()}</h1>";
            foreach($user->getVideos() as $video){
                echo "<h1>{$video->getTitle()}</h1>";
            }
        }*/
        return $this->json($user);
    }
    
     public function create(Request $request): Response
    {
         //Get data
         $json = $request->get("json", null);
         
         //Decode it
         $jsonDecoded = json_decode($json);
        
        //Response by default
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "No envio los datos correctamente"
        ];
         
        //Check if it's an object
        if(is_object($jsonDecoded)){
            
            //Assign values
            $name = (!empty($jsonDecoded->name)) ? $jsonDecoded->name : null;
            $surname = (!empty($jsonDecoded->surname)) ? $jsonDecoded->surname : null;
            $email = (!empty($jsonDecoded->email)) ? $jsonDecoded->email : null;
            $password = (!empty($jsonDecoded->password)) ? $jsonDecoded->password : null;
            
            //Validate email
            $validator = Validation::createValidator();
            $validate_email = $validator->validate($email, [
                new Email()
            ]);
                    
            //Assign values to user if credentials are right
            if($name != null && $surname != null && $email != null && $password != null && count($validate_email) == 0){
                
                //Assign values to user if credentials are right
                $user = new User();
                $user->setName($name);
                $user->setSurname($surname);
                $user->setEmail($email);
                $user->setRole("USER_ROLE");
                $user->setCreatedAt(new \DateTime("now"));
                
                //Encrypt ´password
                $passwordEncrypted = hash("sha256", $password);
                $user->setPassword($passwordEncrypted);
                
                $userRepo = $this->getDoctrine()->getRepository(User::class);
                $em = $this->getDoctrine()->getManager();
                
                //Check if user already exists
                $isset_user = $userRepo->findBy(array(
                    "email" => $email
                ));
                
                //Successful response
                if(count($isset_user) == 0){
                    $em->persist($user);
                    $em->flush();
                    $data = [
                        "status" => "success",
                        "code" => 200,
                        "message" => "Usuario guardado correctamente",
                        "user" => $user
                    ];
                }else{
                    $data = [
                        "status" => "error",
                        "code" => 400,
                        "message" => "EL usuario ya existe"
                    ];
                }
            }
            
        }


        return $this->json($data);
    }
    
    public function login(Request $request, Jwt_auth $jwtAuth){
        //Get data
        $json = $request->get("json", null);
         
        //Decode it
        $jsonDecoded = json_decode($json);
        
        //Default response
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "No envio los datos correctamente"
        ];
        
        //Validate data
        if(is_object($jsonDecoded)){
           
            $password = (!empty($jsonDecoded->password)) ? $jsonDecoded->password : null;
            $email = (!empty($jsonDecoded->email)) ? $jsonDecoded->email : null;

            $validator = Validation::createValidator();
            $validate_email = $validator->validate($email, [
                new Email()
            ]);
                    
         
            if($email != null && $password != null && count($validate_email) == 0){
                $password = hash("sha256", $password);
                
                //Jwt service 
                if(isset($jsonDecoded->getToken)){
                    $data = $jwtAuth->signup($email, $password, true);
                }else{
                    $data = $jwtAuth->signup($email, $password);
                }
            }
            
        }
        
        //Return final response
        return $this->json($data);
    }
    
    public function update(Request $request, Jwt_auth $jwtAuth){
        //Get authorization header
        $token = $request->headers->get("Authorization");

        //Check Token
        $auth = $jwtAuth->checkToken($token);
        
        //Default response
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "No envio los datos correctamente"
        ];
        
        if($auth){
            //Get data from request
             $json = $request->get("json", null);
         
            //Decode it
            $jsonDecoded = json_decode($json);
            
            //Validate data
            $name = (!empty($jsonDecoded->name)) ? $jsonDecoded->name : null;
            $surname = (!empty($jsonDecoded->surname)) ? $jsonDecoded->surname : null;
            $email = (!empty($jsonDecoded->email)) ? $jsonDecoded->email : null;
            
            //Validate email
            $validator = Validation::createValidator();
            $validate_email = $validator->validate($email, [
                new Email()
            ]);
                    
            //Assign values to user if credentials are right
            if($name != null && $surname != null && $email != null && count($validate_email) == 0){
                $decodedToken = $jwtAuth->checkToken($token, true);
                //Find user to update
                $userRepo = $this->getDoctrine()->getRepository(User::class);
                $em = $this->getDoctrine()->getManager();
                
                $user = $userRepo->findOneBy([
                    "id" => $decodedToken->sub
                ]);
                

                //Find users with the same email
                $isset_user = $userRepo->findBy([
                    "email" => $email
                ]);
                
                if(count($isset_user) == 0 || $user->getEmail() == $email){
                    //Assign values to user
                    $user->setEmail($email);
                    $user->setSurname($surname);
                    $user->setName($name);
                    //Save user on db 

                    $em->persist($user);
                    $em->flush($user);
                    
                    $data = [
                        "status" => "success",
                        "code" => 200,
                        "message" => "Usuario actualizado correctamente",
                        "user" => $user
                    ];
                }else{
                    $data = [
                        "status" => "error",
                        "code" => 400,
                        "message" => "Error al actualizar el usuario"
                    ];
                }
            }
           
        }
        
        //Return final response
        return $this->json($data);
    }
}
