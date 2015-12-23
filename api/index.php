<?php

  use \Psr\Http\Message\ServerRequestInterface as Request;
  use \Psr\Http\Message\ResponseInterface as Response;

  use \Firebase\JWT\JWT;

  require 'vendor/autoload.php';

  $app = new \Slim\App;

  // SLIM Middleware for checking if there is a token in the request
  $app->add(function ($request, $response, $next) use ($app) {
  
    // init
    $app->jwt = false;
    
    // Key
    $secretKey = base64_decode("mysecretkey");
  
    // JWT Auth Object
    $jwta = new \Slim\Middleware\JwtAuthentication([
      "secret" => $secretKey,
      "path" => "/data"
    ]);
    
    // fetch token from request
    $token = $jwta->fetchToken($request);
    if ($token) {
      
      // decode token
      if ($decode = $jwta->decodeToken($token)) {
        $app->jwt = $decode;
      }
    }
        
    return $next($request, $response);
  });


  // LOGIN: check credentials and generate a new JWT
  $app->post('/login', function (Request $request, Response $response) {
      
    $parsedBody = $request->getParsedBody();

    $username = $parsedBody["name"];
    $password = $parsedBody["password"];
    
    // check username & password
    if ($username == "test" && $password == "test") {
      
      // generate a new jwt
      $tokenId    = base64_encode(mcrypt_create_iv(32));
      $issuedAt   = time();
      $notBefore  = $issuedAt + 10;             //Adding 10 seconds
      $expire     = $notBefore + 60;            // Adding 60 seconds
      $serverName = "myserver";
      
      $data = [
        'iat'  => $issuedAt,         // Issued at: time when the token was generated
        'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
        'iss'  => $serverName,       // Issuer
        'nbf'  => $notBefore,        // Not before
        //'exp'  => $expire,           // Expire
        'data' => [                  // Data related to the signer user
            'userId'   => "1", // userid from the users table
            'userName' => "test" // User name
          ]
      ];

      $secretKey = base64_decode("mysecretkey");
            
      $jwt = JWT::encode(
        $data,      //Data to be encoded in the JWT
        $secretKey, // The signing key
        'HS512'     // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
        );
    
      $unencodedArray = ['token' => $jwt];
      
      return $response->getBody()->write(json_encode($unencodedArray));
      
    } else {
      
      return $response->withStatus(401, "Authentication failed");
    }
  });

  // DATA - mixed personal and public data
  $app->get("/data", function (Request $request, Response $response) use ($app) {
    $data = ["apple", "banana"];
  
    if ($app->jwt) {
      $data = $app->jwt;
    }
    
    return $response->getBody()->write(json_encode($data));
  });

  $app->run();

?>