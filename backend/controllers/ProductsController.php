<?php
require_once __DIR__."/../core/Controller.php";

class ProductsController extends Controller {
    private $ProductsModel;

    public function __construct(){
        $this->ProductsModel = $this->model("Products");
    }
    public function getAll(){
        $this->validateRequest('GET');
        $this->success($this->ProductsModel->getAll());
    }
    public function getById($id){
        $this->validateRequest('GET');
        $product =$this->ProductsModel->getById($id);
        if($product){
            $this->success($product);
        }else{
            $this->error("the id $id is not exist");
        }
        
    }
}
?>