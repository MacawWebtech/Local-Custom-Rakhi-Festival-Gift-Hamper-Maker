(() => {
  const posts = window.tyohaarJournal;
  const stories = [...document.querySelectorAll('[data-story]')];
  const topics = [...document.querySelectorAll('[data-topic]')];
  const query = document.querySelector('#journal-query');
  const count = document.querySelector('#journal-count');
  const empty = document.querySelector('#journal-empty');
  let topic = 'All stories';
  function filterStories() {
    const search = query.value.trim().toLocaleLowerCase();
    let visible = 0;
    stories.forEach(story => {
      const post = posts.find(item => item.id === story.dataset.story);
      const matches = (topic === 'All stories' || post.category === topic) &&
        [post.title, post.copy, post.category, ...post.paragraphs].join(' ').toLocaleLowerCase().includes(search);
      story.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = visible + (visible === 1 ? ' story' : ' stories') + ' to inspire your next gift.';
    empty.hidden = visible !== 0;
    topics.forEach(button => {
      const selected = button.dataset.topic === topic;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  document.querySelector('#journal-search').addEventListener('submit', event => {
    event.preventDefault();
    filterStories();
  });
  query.addEventListener('input', filterStories);
  topics.forEach(button => button.addEventListener('click', () => {
    topic = button.dataset.topic;
    filterStories();
  }));
  document.querySelector('#journal-reset').addEventListener('click', () => {
    topic = 'All stories';
    query.value = '';
    filterStories();
    query.focus();
  });
  filterStories();
})();
