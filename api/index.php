<?php

  use \Psr\Http\Message\ServerRequestInterface as Request;
  use \Psr\Http\Message\ResponseInterface as Response;

  use \Firebase\JWT\JWT;

  require 'vendor/autoload.php';

  $app = new \Slim\App;

/*
  $app->add(new \Slim\Middleware\JwtAuthentication([
      "secret" => "your_example_key",
      "callback" => function ($options) use ($app) {
          $app->jwt = $options["decoded"];
      }
  ]));

  $app->get("/user", function () {
      print_r($app->jwt);
  });

*/

  $app->get('/login', function (Request $request, Response $response) {
  
    // if credentials == correct
    
    $tokenId    = base64_encode(mcrypt_create_iv(32));
    $issuedAt   = time();
    $notBefore  = $issuedAt + 10;             //Adding 10 seconds
    $expire     = $notBefore + 60;            // Adding 60 seconds
    $serverName = "servername"; // Retrieve the server name from config file
    
    
    $data = [
        'iat'  => $issuedAt,         // Issued at: time when the token was generated
        'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
        'iss'  => $serverName,       // Issuer
        'nbf'  => $notBefore,        // Not before
        'exp'  => $expire,           // Expire
        'data' => [                  // Data related to the signer user
            'userId'   => "1", // userid from the users table
            'userName' => "test" // User name
        ]
    ];

    
    $secretKey = base64_decode("key");
    
    
    $jwt = JWT::encode(
        $data,      //Data to be encoded in the JWT
        $secretKey, // The signing key
        'HS512'     // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
        );
    
    
     $unencodedArray = ['jwt' => $jwt];
    
    $response->getBody()->write(json_encode($unencodedArray));

    return $response;
  });
  $app->run();


?>