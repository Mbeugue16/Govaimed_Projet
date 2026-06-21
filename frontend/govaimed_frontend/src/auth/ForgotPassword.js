import React, { useState } from "react";
import { postData } from "../api/endpoint";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await postData("/auth/forgot-password", { email });
    setMessage(data.message);

    console.log("Lien :", data.resetUrl); // pour test
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Mot de passe oublié</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Envoyer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;