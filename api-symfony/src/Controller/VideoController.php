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
use Knp\Component\Pager\PaginatorInterface;

class VideoController extends AbstractController
{

    public function index(): Response
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/VideoController.php',
        ]);
    }
    
    public function create(Request $request, Jwt_auth $jwtAuth, $id = null){
           
        // get authorization header
        $token = $request->headers->get("Authorization");
        
        //check token
        $auth = $jwtAuth->checkToken($token);

        //Response by default
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "El token es invalido"
        ];
        
        if($auth){
            //Get data
            $json = $request->get("json", null);
            $jsonDecoded = json_decode($json);
            
            $tokenDecoded = $jwtAuth->checkToken($token, true);

            //Validate data
            $title = (!empty($jsonDecoded->title)) ? $jsonDecoded->title : null;
            $description = (!empty($jsonDecoded->description)) ? $jsonDecoded->description : null;
            $url = (!empty($jsonDecoded->url)) ? $jsonDecoded->url : null;
            
            if(!empty($title) && !empty($url)){
                $em = $this->getDoctrine()->getManager();

                //Save new video
                if($id == null){
                    //Find user
                    $user = $this->getDoctrine()->getRepository(User::class)->findOneBy([
                        "id" => $tokenDecoded->sub
                    ]);
                    $video = new Video();
                    //Assign values to video
                    $video->setTitle($title);
                    $video->setDescription($description);
                    $video->setUrl($url);
                    $video->setUser($user);
                    $video->setStatus("normal");
                    $video->setCreatedAt(new \DateTime("now"));
                    $video->setUpdatedAt(new \DateTime("now"));

                    //Save video on db
                    $em->persist($video);
                    $em->flush();

                    $data = [
                        "status" => "success",
                        "code" => 200,
                        "message" => "Video guardado exitosamente",
                        "video" => $video
                    ];      
                }else{
                    //Update video
                    $foundVideo = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                        "id" => $id,
                        "user" => $tokenDecoded->sub
                    ]);
                    
                    if($foundVideo && is_object($foundVideo)){
                        $foundVideo->setTitle($title);
                        $foundVideo->setDescription($description);
                        $foundVideo->setUrl($url);
                        $foundVideo->setUpdatedAt(new \DateTime("now"));
                        
                        $em->persist($foundVideo);
                        $em->flush();
                        
                        $data = [
                            "status" => "success",
                            "code" => 200,
                            "message" => "Video actualizado exitosamente",
                            "video" => $foundVideo
                        ];  
                    }else{
                        $data = [
                            "status" => "error",
                            "code" => 400,
                            "message" => "No se pudo actualizar el video",
                        ]; 
                    }
                }
            }else{
                $data = [
                    "status" => "error",
                    "code" => 400,
                    "message" => "No envio los datos correctamente"
                ];                
            }
            
        }

        return $this->json($data);
    }
    
    public function videos(Request $request, Jwt_auth $jwtAuth, PaginatorInterface $paginator){
         // get authorization header
        $token = $request->headers->get("Authorization");
        
        //check token
        $auth = $jwtAuth->checkToken($token);

        
        if($auth){
            //get page number
            $page = $request->query->get("page", 1);
            $limit = 6;
            //Get user
            $identity = $jwtAuth->checkToken($token, true);

            //Entity Manager
            $em = $this->getDoctrine()->getManager();

            //Consult in dql
            $dql = "SELECT v FROM App\Entity\Video v WHERE v.user = {$identity->sub} ORDER BY v.id DESC";
            $consult = $em->createQuery($dql);
            
            //Pagination
            $pagination = $paginator->paginate($consult, $page, $limit);
            $total = $pagination->getTotalItemCount();
            
            $data = [
                "status" => "success",
                "code" => 200,
                "total_items_count" => $total,
                "current_page" => $page,
                "items_per_page" => $limit,
                "total_pages" => ceil($total / $limit),
                "videos" => $pagination,
                "user_id" => $identity->sub
            ];
        }else{
            $data = [
                "status" => "error",
                "code" => 400,
                "message" => "No se pueden listar los videos en este momento"
            ];
        }
        
        return $this->json($data);
    }
    
    public function detail($id, Jwt_auth $jwtAuth, Request $request){
         // get authorization header
        $token = $request->headers->get("Authorization");
        
        //check token
        $auth = $jwtAuth->checkToken($token);
        
        //Response by default
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "No se pudo encontrar el video"
        ];
        if($auth){
            //Get user
            $identity = $jwtAuth->checkToken($token, true);
            
            //Find video 
            $video = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                "id" => $id,
                 "user" => $identity->sub
            ]);
            
            if($video && is_object($video)){
                $data = [
                    "status" => "success",
                    "code" => 200,
                    "video" => $video
                ];
            }
        }
        
        return $this->json($data);
    }
    
    public function remove($id, Jwt_auth $jwtAuth, Request $request){
         // get authorization header
        $token = $request->headers->get("Authorization");
        
        //check token
        $auth = $jwtAuth->checkToken($token);
        
        //Response by default
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "No se pudo eliminar el video"
        ];
        
        if($auth){
            //Get user
            $identity = $jwtAuth->checkToken($token, true);
            
            //Find video 
            $video = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                "id" => $id,
                 "user" => $identity->sub
            ]);
            
            if($video && is_object($video)){
                $em = $this->getDoctrine()->getManager();
                $em->remove($video);
                $em->flush();
                
                $data = [
                    "status" => "success",
                    "code" => 200,
                    "message" => "Video eliminado exitosamente",
                    "video" => $video
                ];
            }
        }
        
        return $this->json($data);
    }
}
