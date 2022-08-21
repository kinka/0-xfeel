import styles from './App.module.css';
import { createEffect, createRenderEffect, createSignal, onMount } from 'solid-js';

function App() {
  const initParams = (new URL(location.href)).searchParams;

  const [content, setContent] = createSignal(initParams.get('text'));
  const [analysis, setAnalysis] = createSignal('');

  function model(el, value) {
    const [field, setField] = value();
    createRenderEffect(() => (el.value = field()));
    let timerId;
    el.addEventListener("input", (e) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        analyze(field());
      }, 2000);
      setField(e.target.value);
    });
  }

  onMount(() => {
    apiFetch('lexer', {text: initParams.get('text')}).then(res => {
      setAnalysis(JSON.stringify(res.items, null, '\t'));
    });
  })

  function apiFetch(path, payload) {
    const accessToken = initParams.get('access_token');
    return fetch(`https://aip.baidubce.com/rpc/2.0/nlp/v1/${path}?access_token=${accessToken}&charset=UTF-8`, 
    { body: JSON.stringify(payload), method: 'post', mode: 'cors', headers: { 'Content-Type': 'application/json' } })
    .then(res => res.json());
  }

  function analyze(content) {
    const talk = apiFetch('emotion', { "scene": "talk", "text": content });
    const emotion = apiFetch('sentiment_classify', {text: content});

    return Promise.all([talk, emotion]).then(([res1, res2]) => {
      setAnalysis(JSON.stringify([...res1.items, ...res2.items], null, '\t'));
    });
  }

  return (
    <div class={styles.App}>
      <section class={styles.Content}>
        <textarea class={styles.Writer} use:model={[content, setContent]}></textarea>
      </section>
      <section class={styles.Suggestions}>
        {analysis}
      </section>
    </div>
  );
}

export default App;
