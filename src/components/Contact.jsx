import React, { useEffect, useRef, useState } from "react";
import "./Contact.css";
const Message = ({ content, type }) => {
  return (
    <div className={"ContactMess " + (type ? "nice" : "bad")}>{content}</div>
  );
};

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mess, setMess] = useState(false);
  const [messContent, setMessContent] = useState("");
  const [messType, setMessType] = useState(null);

  const fullNameInput = useRef();
  const emailInput = useRef();
  const phoneInput = useRef();
  const conTextarea = useRef();

  function validation(fullname, email, phone, context) {
    setFullName(fullname);
    setEmail(email);
    setPhone(phone);
    if (fullname != "" && email != "" && phone != "" && context != "") {
      setMessContent("Thank you, we will try to contact you later");
      setMessType(true);

      // send data in api

      fullNameInput.current.value="";
      emailInput.current.value="";
      phoneInput.current.value="";
      conTextarea.current.value="";

    } else {
      setMessContent("please enter all info !");
      setMessType(false);
    }
    setMess(true);
    setTimeout(() => {
      setMess(false);
    }, 2000);
  }

  return (
    <section className="contact">
      <form>
        {mess ? <Message content={messContent} type={messType} /> : <></>}
        <h1>Contact Us</h1>
        <label htmlFor="fullName">Full Name</label>
        <input type="text" id="fullName" ref={fullNameInput} />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="Example : mohamed2005@gmail.com"
          ref={emailInput}
        />
        <label htmlFor="tel">Phone Number</label>
        <input
          type="tel"
          id="tel"
          placeholder="Example : 0610781044"
          ref={phoneInput}
        />

        <label htmlFor="context">Context</label>
        <textarea id="context" ref={conTextarea}></textarea>
        <input
          type={messType ? "hidden" : "submit"}
          className="btn-p"
          onClick={(e) => {
            e.preventDefault();
            validation(
              fullNameInput.current.value,
              emailInput.current.value,
              phoneInput.current.value,
              conTextarea.current.value
            );
          }}
        />
      </form>
    </section>
  );
};

export default Contact;
