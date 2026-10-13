(() => {
  const posts = window.tyohaarJournal;
  const requested = new URLSearchParams(location.search).get('story');
  const post = requested === null ? posts[0] : posts.find(item => item.id === requested);
  const element = id => document.getElementById(id);
  if (!post) {
    element('article-title').textContent = 'We couldn’t find that story.';
    element('article-topic').textContent = 'THE GIFTING JOURNAL';
    element('article-deck').textContent = 'There are more thoughtful ideas waiting in the journal.';
    element('article-meta').hidden = true;
    element('article-content').hidden = true;
    element('article-missing').hidden = false;
    document.title = 'Story not found | Tyohaar Journal';
    return;
  }
  document.title = post.title + ' | Tyohaar Journal';
  document.querySelector('meta[name="description"]').content = post.copy;
  element('article-topic').textContent = post.category;
  element('article-title').textContent = post.title;
  element('article-deck').textContent = post.copy;
  element('article-author').textContent = 'By ' + post.author;
  const date = new Date(post.date + 'T12:00:00Z');
  element('article-date').textContent = date.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'});
  element('article-date').dateTime = post.date;
  const words = [...post.paragraphs, ...post.tips].join(' ').trim().split(/\s+/).length;
  element('article-read-time').textContent = Math.max(1, Math.ceil(words / 200)) + ' min read';
  const image = element('article-image');
  image.src = 'assets/images/' + post.image + '.jpg';
  image.alt = post.category + ' gifts';
  const sections = element('article-sections');
  const contents = element('article-toc');
  sections.replaceChildren();
  contents.replaceChildren();
  post.paragraphs.forEach((text, index) => {
    const section = document.createElement('section');
    section.id = 'part-' + (index + 1);
    const heading = document.createElement('h2');
    heading.textContent = post.headings[index];
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    section.append(heading, paragraph);
    sections.append(section);
    const link = document.createElement('a');
    link.href = '#' + section.id;
    link.textContent = post.headings[index];
    contents.append(link);
  });
  element('article-quote').textContent = post.quote;
  element('article-tips').replaceChildren();
  post.tips.forEach(text => {
    const item = document.createElement('li');
    item.textContent = text;
    element('article-tips').append(item);
  });
  element('article-shop').href = post.shop;
  const related = element('article-related');
  related.replaceChildren();
  const others = posts.filter(item => item.id !== post.id);
  const chosen = [...others.filter(item => item.category === post.category), ...others.filter(item => item.category !== post.category)].slice(0, 3);
  chosen.forEach(item => {
    const card = document.createElement('article');
    card.className = 'journal-story';
    const link = document.createElement('a');
    link.className = 'journal-image';
    link.href = 'blog-details.html?story=' + encodeURIComponent(item.id);
    link.setAttribute('aria-label', 'Read ' + item.title);
    const img = document.createElement('img');
    img.src = 'assets/images/' + item.image + '.jpg';
    img.alt = item.category + ' gifts';
    img.width = 1200;
    img.height = 900;
    img.loading = 'lazy';
    link.append(img);
    const category = document.createElement('span');
    category.className = 'eyebrow';
    category.textContent = item.category;
    const heading = document.createElement('h3');
    heading.textContent = item.title;
    const copy = document.createElement('p');
    copy.textContent = item.copy;
    const action = document.createElement('a');
    action.className = 'text-button journal-read';
    action.href = link.href;
    action.textContent = 'Read the guide ↗';
    card.append(link, category, heading, copy, action);
    related.append(card);
  });
  const url = new URL('blog-details.html', location.href);
  url.searchParams.set('story', post.id);
  const sharedText = post.title + '\n' + url.href;
  element('share-whatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(sharedText);
  element('share-email').href = 'mailto:?subject=' + encodeURIComponent(post.title) + '&body=' + encodeURIComponent(sharedText);
  element('share-link').value = url.href;
  element('copy-article').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url.href);
      element('share-link-fallback').hidden = true;
      element('article-share-status').textContent = 'Article link copied.';
    } catch {
      element('share-link-fallback').hidden = false;
      element('share-link').focus();
      element('share-link').select();
      element('article-share-status').textContent = 'Select and copy the article link below.';
    }
  });
})();
