<?php
require_once __DIR__."/../config/db.php";

class Database {
    private $host = HOST;
    private $dbName = DATABASE ;
    private $username = USERNAME;
    private $password = PASSWORD ;

    private $conn;
    private $stmt;

    public function __construct(){
        try{
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->dbName}",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        }catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }


    public function query($sql){
        $this->stmt = $this->conn->query($sql);
        return $this->stmt;
    }

    public function fetchAll(){
        return $this->stmt->fetchAll();
    }

    public function fetch() {
        return $this->stmt->fetch();
    }
    
    public function rowCount() {
        return $this->stmt->rowCount();
    }

}

?>