<?php
require_once __DIR__."/../core/Controller.php";

class ContactController extends Controller {
    private $ContactModel;

    public function __construct(){
        $this->ContactModel = $this->model("Contact");
    }

    public function getAll(){
        $this->validateRequest('GET');
        $this->success($this->ContactModel->getAll());
    }

    public function getById($id){
        $this->validateRequest('GET');
        $contact = $this->ContactModel->getById($id);
        if($contact){
            $this->success($contact);
        }else{
            $this->error("the contact id $id is not exist");
        }
    }
}
?>