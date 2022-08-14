import styles from './App.module.css';
import { createEffect, createRenderEffect, createSignal } from 'solid-js';

function App() {
  let textRef;
  const [content, setContent] = createSignal('how do you feel?');

  function model(el, value) {
    const [field, setField] = value();
    createRenderEffect(() => (el.value = field()));
    let timerId;
    el.addEventListener("input", (e) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        console.log(field());
      }, 3000);
      setField(e.target.value);
    });
  }

  return (
    <div class={styles.App}>
      <section class={styles.Content}>
        <textarea class={styles.Writer} use:model={[content, setContent]}></textarea>
      </section>
      <section class={styles.Suggestions}>
        {content}
      </section>
    </div>
  );
}

export default App;
