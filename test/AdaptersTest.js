import { default as expect } from 'expect.js';
import { Adapters } from '../src/index.js';

describe('Adapters', () => {

  it(`should be able to use adapters for empty types`, () => {
    const a = new Adapters();
    a.set('', 'b', 'FOOBAR');
    expect(a.get('a', 'b')).eql('FOOBAR');
    expect(a.remove('', 'b')).eql('FOOBAR');
    expect(a.get('a', 'b')).be(undefined);
    expect(a.remove('', 'b')).be(undefined);
  });

  it(`should be able to register and retrieve and remove exact adapter`, () => {
    const a = new Adapters();
    a.set('a', 'b', 'FOOBAR');
    expect(a.get('a', 'b')).eql('FOOBAR');
    expect(a.remove('a', 'b')).eql('FOOBAR');
    expect(a.get('a', 'b')).be(undefined);
    expect(a.remove('a', 'b')).be(undefined);
  });

  it(`should be able to retrieve adapters by parent target keys`, () => {
    const a = new Adapters();
    a.set('menu', 'file', 'File menu');
    expect(a.get('menu', 'file.text')).eql('File menu');
    expect(a.get('menu', 'file.text.markdown')).eql('File menu');
    expect(a.getAll('menu', 'file.text.markdown')).eql(['File menu']);

    a.set('menu', 'file.text', 'Menu for text files');
    expect(a.get('menu', 'file.text')).eql('Menu for text files');
    expect(a.get('menu', 'file.text.markdown')).eql('Menu for text files');
    expect(a.getAll('menu', 'file.text.markdown')).eql(['Menu for text files', 'File menu']);
  });

  it(`should be able to retrieve adapters by parent source keys`, () => {
    const a = new Adapters();
    a.set('menu', 'file', 'Show files in menus');
    expect(a.get('menu.context', 'file')).eql('Show files in menus');
    expect(a.get('menu.context.editor', 'file')).eql('Show files in menus');
    expect(a.get('menu.context.editor.code', 'file')).eql('Show files in menus');

    a.set('menu.context.editor', 'file', 'Show files in context EDITOR menu');
    expect(a.get('menu.context', 'file')).eql('Show files in menus');
    expect(a.get('menu.context.editor', 'file')).eql('Show files in context EDITOR menu');
    expect(a.get('menu.context.editor.code', 'file')).eql('Show files in context EDITOR menu');

    expect(a.getAll('menu.context.editor.code', 'file')).eql(['Show files in context EDITOR menu', 'Show files in menus']);
  });

  it(`should be able to retrieve adapters by parent and source keys`, () => {
    const a = new Adapters();
    a.set('menu', 'file', 'Show files in menus');
    expect(a.get('menu.context', 'file.text.javascript')).eql('Show files in menus');
    expect(a.get('menu.context.editor', 'file.text.javascript')).eql('Show files in menus');
    expect(a.get('menu.context.editor.code', 'file.text.javascript')).eql('Show files in menus');

    a.set('menu.context.editor', 'file.text', 'Show TEXT files in context EDITOR menu');
    a.set('menu.context.editor', 'file.text.java', 'Show Java source files in context EDITOR menu');
    expect(a.get('menu.context', 'file.text')).eql('Show files in menus');
    expect(a.get('menu.context.editor', 'file')).eql('Show files in menus');
    expect(a.get('menu.context.editor', 'file.text')).eql('Show TEXT files in context EDITOR menu');
    expect(a.get('menu.context.editor.code', 'file.text.javascript')).eql('Show TEXT files in context EDITOR menu');
    expect(a.get('menu.context.editor.code', 'file.text.java')).eql('Show Java source files in context EDITOR menu');

    expect(a.getAll('menu.context.editor.code', 'file.text.java')).eql([
      'Show Java source files in context EDITOR menu',
      'Show TEXT files in context EDITOR menu',
      'Show files in menus'
    ]);
  });


})