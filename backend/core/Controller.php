<?php
class Controller{

    public function model($model){
        $modelPath = __DIR__."/../models/".$model.".php";
        if(file_exists($modelPath)){
            require_once $modelPath;
            return new $model();
        }else{
            die("the model $model is not exist");
        }
    }

    public function json($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public function success($data = [], $message = 'Success') {
        $this->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }

    public function error($message = 'Error', $statusCode = 400) {
        $this->json([
            'success' => false,
            'message' => $message
        ], $statusCode);
    }

    public function validateRequest($method) {
        if ($_SERVER['REQUEST_METHOD'] !== $method) {
            $this->error('Method not allowed', 405);
        }
    }
}
?>