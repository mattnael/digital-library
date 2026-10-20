// Search terms are wrapped outside SQL so the statement text stays fixed;
// wildcard characters typed by the user remain literal within the value.
export function likePattern(term) {
  if (!term) {
    return null;
  }
  return ['%', term, '%'].join('');
}
