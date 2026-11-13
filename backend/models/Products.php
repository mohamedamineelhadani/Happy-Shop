<?php
require_once __DIR__."/../Core/Model.php";
class Products extends Model {
    protected $table = "products";



    public function getAll($order = "id ASC"){
        $products = parent::getAll($order);
        foreach ($products as $index => $product) {
            $products[$index]["rating"] = $this->getOne("SELECT rate , count FROM rating WHERE id_product = {$product["id"]}");
        }
        return $products;
    }


    public function getById($id){
        $product =parent::getById($id);
        if($product){
            $product["rating"] = $this->getOne("SELECT rate , count FROM rating WHERE id_product = $id");
            return $product;
        }
    }
}
?>