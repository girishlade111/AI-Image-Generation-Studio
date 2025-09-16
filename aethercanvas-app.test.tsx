import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AetherCanvas from './aethercanvas-app';

// Mocking random and DOM-related methods that are not implemented in JSDOM
global.Math.random = () => 0.5;
window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

describe('AetherCanvas', () => {
  test('filters mock images in the gallery', async () => {
    render(<AetherCanvas />);

    // Switch to gallery tab
    fireEvent.click(screen.getByText('Gallery'));

    // Initially, all 3 mock images should be present
    const initialImages = await screen.findAllByRole('img');
    expect(initialImages).toHaveLength(3);

    // Filter by favorites
    fireEvent.click(screen.getByText('Favorites'));

    // After filtering by favorites (and none are favorited), the mock images should disappear.
    // This is what will fail before the fix.
    const imagesAfterFilter = screen.queryAllByRole('img');
    expect(imagesAfterFilter).toHaveLength(0);
  });
});
