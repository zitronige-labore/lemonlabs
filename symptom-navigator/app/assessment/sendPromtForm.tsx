import { sendPrompt } from "../actions";

export default function SendPromptForm() {

  return (
    <form action={sendPrompt} style={{ color: "#000000"}}>
      <label htmlFor="textfeld">Hier Promt eingeben: </label>
      <input style={{backgroundColor: "#d4d4d4"}} type="text" id="textfeld" name="textfeld" required />
      <button style={{backgroundColor: "#d4d4d4", margin: 10, paddingLeft: 10, paddingRight: 10}} type="submit">bestaetigen</button>
    </form>
  );
}
