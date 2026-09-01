import assert from "node:assert/strict";
import test from "node:test";
import { addHeadingAnchors, anchorSlug } from "./utils";

test("anchorSlug matches the mega-menu fragment convention", () => {
  assert.equal(
    anchorSlug("Wettbewerbs-, Kunden- und Regulierungsanalyse"),
    "wettbewerbs-kunden-und-regulierungsanalyse",
  );
  assert.equal(anchorSlug("Marktanalysen für Indien"), "marktanalysen-fur-indien");
});

test("addHeadingAnchors derives IDs from formatted and encoded heading text", () => {
  assert.equal(
    addHeadingAnchors("<h2 class=\"wp-block-heading\"><strong>Kapitalstruktur &amp; Finanzen</strong></h2>"),
    '<h2 class="wp-block-heading" id="kapitalstruktur-finanzen"><strong>Kapitalstruktur &amp; Finanzen</strong></h2>',
  );
});

test("addHeadingAnchors preserves authored IDs and makes generated IDs unique", () => {
  assert.equal(
    addHeadingAnchors("<h2 id=\"authored\">Analyse</h2><h3>Analyse</h3><h3>Analyse</h3>"),
    '<h2 id="authored">Analyse</h2><h3 id="analyse">Analyse</h3><h3 id="analyse-2">Analyse</h3>',
  );
});
