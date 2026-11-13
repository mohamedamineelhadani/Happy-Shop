<?php
require_once __DIR__."/Database.php";

class Model{
    protected $db;
    protected $table;

    public function __construct(){
        $this->db = new Database();
    }

    public function getAll($order ="id ASC"){
        $sql= "SELECT * FROM {$this->table} ORDER BY $order";
        return $this->db->query($sql)->fetchAll();
    }

    public function getById($id){
        $sql = "SELECT * FROM {$this->table} WHERE id = $id";
        return $this->db->query($sql)->fetch();
    }


    public function getData($sql){
        return $this->db->query($sql)->fetchAll();
    }

    public function getOne($sql){
        return $this->db->query($sql)->fetch();
    }


    public function Count(){
        return $this->db->rowCount();
    }
    
}
?>