import '../src';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<section class="skip__container" aria-labelledby="skip-link">
      <a id="skip-link" class="skip__btn" tabindex="0" href="#content">Skip to main content</a>
    </section>
    <main id="content">
      <button id="test-2"></button>
    </main>`;
};

const dispatchHashChange = () => {
  const event = document.createEvent('Event');
  event.initEvent('hashchange', true, true);
  window.dispatchEvent(event);
};

describe(`Initialisation`, () => {
    
  beforeAll(init);

  it('should attach a hashchange eventListener', () => {
    
    window.location.hash = '#content';
    dispatchHashChange(); // otherwise not picked up by JSDOM

    expect(document.activeElement).toEqual(document.getElementById('content'));
  });
  
  it('should ignore any hashes that do not match element ids', () => {
    
    window.location.hash = '#not-matched';
    dispatchHashChange(); // otherwise not picked up by JSDOM
    expect(document.activeElement).toEqual(document.getElementById('content'));
  
  });
  
  it('should find any ids matching the new hash and focus on them', () => {
  
    window.location.hash = '#test-2';
    dispatchHashChange(); // otherwise not picked up by JSDOM
    expect(document.activeElement).toEqual(document.getElementById('test-2'));
  
  });

});


