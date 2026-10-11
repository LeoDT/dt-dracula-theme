// Layer-shell geometry: margins, spacing and the reserved bar height are widget
// properties, so they cannot live in the SCSS token set. Visual tokens stay in
// theme/*.scss. ISLAND_HEIGHT is the single source of truth for the bar height.
export const SCREEN_GAP_X = 8;
export const BAR_GAP_Y = 8;
export const ISLAND_HEIGHT = 48;
export const ISLAND_SPACING = 6;
export const WORKSPACE_SPACING = 4;

// Reserved from the top edge: gap + island + gap, so maximized windows stop
// below the islands with breathing room instead of touching the island edge.
export const EXCLUSIVE_ZONE = BAR_GAP_Y + ISLAND_HEIGHT + BAR_GAP_Y;
