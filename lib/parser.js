module.exports = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { Expression: peg$parseExpression },
        peg$startRuleFunction  = peg$parseExpression,

        peg$c0 = function(e) { return e; },
        peg$c1 = " ",
        peg$c2 = { type: "literal", value: " ", description: "\" \"" },
        peg$c3 = "\t",
        peg$c4 = { type: "literal", value: "\t", description: "\"\\t\"" },
        peg$c5 = ".",
        peg$c6 = { type: "literal", value: ".", description: "\".\"" },
        peg$c7 = /^[a-z]/,
        peg$c8 = { type: "class", value: "[a-z]", description: "[a-z]" },
        peg$c9 = /^[a-z0-9_\-]/,
        peg$c10 = { type: "class", value: "[a-z0-9_-]", description: "[a-z0-9_-]" },
        peg$c11 = function(prefix, suffix) { return prefix + suffix; },
        peg$c12 = "[]",
        peg$c13 = { type: "literal", value: "[]", description: "\"[]\"" },
        peg$c14 = function(f, p) { p.array = f; return p; },
        peg$c15 = function(f, n, o) { var path = { path: [f].concat(n.map(function (i) { return i[1]; })) }; if (o) path.options = o; return path; },
        peg$c16 = "(",
        peg$c17 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c18 = /^[^), ]/,
        peg$c19 = { type: "class", value: "[^), ]", description: "[^), ]" },
        peg$c20 = ",",
        peg$c21 = { type: "literal", value: ",", description: "\",\"" },
        peg$c22 = /^[0-9]/,
        peg$c23 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c24 = function(o, v) { return parseInt(v, 10); },
        peg$c25 = ")",
        peg$c26 = { type: "literal", value: ")", description: "\")\"" },
        peg$c27 = function(o, a) { var options = { operator: o }; if (a.length) options.arguments = a; return options; },
        peg$c28 = "{{",
        peg$c29 = { type: "literal", value: "{{", description: "\"{{\"" },
        peg$c30 = function(l, e) { return e; },
        peg$c31 = function(l, r) { return [l].concat(r); },
        peg$c32 = "}}",
        peg$c33 = { type: "literal", value: "}}", description: "\"}}\"" },
        peg$c34 = function(list) { return { glue: 'AND', list: list }; },
        peg$c35 = "{",
        peg$c36 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c37 = "}",
        peg$c38 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c39 = function(list) { return { glue: 'OR', list: list }; },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseExpression() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseSpace();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseSpace();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseFieldList();
        if (s2 === peg$FAILED) {
          s2 = peg$parseFieldArray();
          if (s2 === peg$FAILED) {
            s2 = peg$parseFieldPath();
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseSpace();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseSpace();
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c0(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSpace() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 32) {
        s0 = peg$c1;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 9) {
          s0 = peg$c3;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
      }

      return s0;
    }

    function peg$parseFieldSeparator() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseSpace();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseSpace();
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c5;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseSpace();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseSpace();
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFieldName() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseSpace();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseSpace();
      }
      if (s1 !== peg$FAILED) {
        if (peg$c7.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          s4 = [];
          if (peg$c9.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (peg$c9.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c10); }
            }
          }
          if (s4 !== peg$FAILED) {
            s3 = input.substring(s3, peg$currPos);
          } else {
            s3 = s4;
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseSpace();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseSpace();
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c11(s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFieldArray() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseFieldName();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c12) {
          s2 = peg$c12;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c13); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseFieldSeparator();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseFieldPath();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c14(s1, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFieldPath() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseFieldList();
      if (s1 === peg$FAILED) {
        s1 = peg$parseFieldArray();
        if (s1 === peg$FAILED) {
          s1 = peg$parseFieldName();
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseFieldSeparator();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseFieldList();
          if (s5 === peg$FAILED) {
            s5 = peg$parseFieldArray();
            if (s5 === peg$FAILED) {
              s5 = peg$parseFieldName();
            }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseFieldSeparator();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseFieldList();
            if (s5 === peg$FAILED) {
              s5 = peg$parseFieldArray();
              if (s5 === peg$FAILED) {
                s5 = peg$parseFieldName();
              }
            }
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseSpace();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseSpace();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseFieldOptions();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c15(s1, s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFieldOptions() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c16;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseSpace();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseSpace();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          s4 = [];
          if (peg$c18.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c19); }
          }
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              if (peg$c18.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c19); }
              }
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s3 = input.substring(s3, peg$currPos);
          } else {
            s3 = s4;
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseSpace();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseSpace();
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$currPos;
              s7 = [];
              s8 = peg$parseSpace();
              while (s8 !== peg$FAILED) {
                s7.push(s8);
                s8 = peg$parseSpace();
              }
              if (s7 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s8 = peg$c20;
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c21); }
                }
                if (s8 !== peg$FAILED) {
                  s9 = [];
                  s10 = peg$parseSpace();
                  while (s10 !== peg$FAILED) {
                    s9.push(s10);
                    s10 = peg$parseSpace();
                  }
                  if (s9 !== peg$FAILED) {
                    s10 = peg$currPos;
                    s11 = [];
                    if (peg$c22.test(input.charAt(peg$currPos))) {
                      s12 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s12 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c23); }
                    }
                    if (s12 !== peg$FAILED) {
                      while (s12 !== peg$FAILED) {
                        s11.push(s12);
                        if (peg$c22.test(input.charAt(peg$currPos))) {
                          s12 = input.charAt(peg$currPos);
                          peg$currPos++;
                        } else {
                          s12 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c23); }
                        }
                      }
                    } else {
                      s11 = peg$FAILED;
                    }
                    if (s11 !== peg$FAILED) {
                      s10 = input.substring(s10, peg$currPos);
                    } else {
                      s10 = s11;
                    }
                    if (s10 !== peg$FAILED) {
                      peg$savedPos = s6;
                      s7 = peg$c24(s3, s10);
                      s6 = s7;
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$currPos;
                s7 = [];
                s8 = peg$parseSpace();
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$parseSpace();
                }
                if (s7 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s8 = peg$c20;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c21); }
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = [];
                    s10 = peg$parseSpace();
                    while (s10 !== peg$FAILED) {
                      s9.push(s10);
                      s10 = peg$parseSpace();
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$currPos;
                      s11 = [];
                      if (peg$c22.test(input.charAt(peg$currPos))) {
                        s12 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s12 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c23); }
                      }
                      if (s12 !== peg$FAILED) {
                        while (s12 !== peg$FAILED) {
                          s11.push(s12);
                          if (peg$c22.test(input.charAt(peg$currPos))) {
                            s12 = input.charAt(peg$currPos);
                            peg$currPos++;
                          } else {
                            s12 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c23); }
                          }
                        }
                      } else {
                        s11 = peg$FAILED;
                      }
                      if (s11 !== peg$FAILED) {
                        s10 = input.substring(s10, peg$currPos);
                      } else {
                        s10 = s11;
                      }
                      if (s10 !== peg$FAILED) {
                        peg$savedPos = s6;
                        s7 = peg$c24(s3, s10);
                        s6 = s7;
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parseSpace();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parseSpace();
                }
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s7 = peg$c25;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c26); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c27(s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFieldList() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c28) {
        s1 = peg$c28;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseSpace();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseSpace();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parseExpression();
          if (s4 !== peg$FAILED) {
            s5 = [];
            s6 = peg$currPos;
            s7 = [];
            s8 = peg$parseSpace();
            while (s8 !== peg$FAILED) {
              s7.push(s8);
              s8 = peg$parseSpace();
            }
            if (s7 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s8 = peg$c20;
                peg$currPos++;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c21); }
              }
              if (s8 !== peg$FAILED) {
                s9 = [];
                s10 = peg$parseSpace();
                while (s10 !== peg$FAILED) {
                  s9.push(s10);
                  s10 = peg$parseSpace();
                }
                if (s9 !== peg$FAILED) {
                  s10 = peg$parseExpression();
                  if (s10 !== peg$FAILED) {
                    peg$savedPos = s6;
                    s7 = peg$c30(s4, s10);
                    s6 = s7;
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
            } else {
              peg$currPos = s6;
              s6 = peg$FAILED;
            }
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$currPos;
              s7 = [];
              s8 = peg$parseSpace();
              while (s8 !== peg$FAILED) {
                s7.push(s8);
                s8 = peg$parseSpace();
              }
              if (s7 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s8 = peg$c20;
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c21); }
                }
                if (s8 !== peg$FAILED) {
                  s9 = [];
                  s10 = peg$parseSpace();
                  while (s10 !== peg$FAILED) {
                    s9.push(s10);
                    s10 = peg$parseSpace();
                  }
                  if (s9 !== peg$FAILED) {
                    s10 = peg$parseExpression();
                    if (s10 !== peg$FAILED) {
                      peg$savedPos = s6;
                      s7 = peg$c30(s4, s10);
                      s6 = s7;
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c31(s4, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseSpace();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseSpace();
            }
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c32) {
                s5 = peg$c32;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c33); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c34(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c35;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c36); }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseSpace();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseSpace();
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseExpression();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$currPos;
              s7 = [];
              s8 = peg$parseSpace();
              while (s8 !== peg$FAILED) {
                s7.push(s8);
                s8 = peg$parseSpace();
              }
              if (s7 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 44) {
                  s8 = peg$c20;
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c21); }
                }
                if (s8 !== peg$FAILED) {
                  s9 = [];
                  s10 = peg$parseSpace();
                  while (s10 !== peg$FAILED) {
                    s9.push(s10);
                    s10 = peg$parseSpace();
                  }
                  if (s9 !== peg$FAILED) {
                    s10 = peg$parseExpression();
                    if (s10 !== peg$FAILED) {
                      peg$savedPos = s6;
                      s7 = peg$c30(s4, s10);
                      s6 = s7;
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$currPos;
                s7 = [];
                s8 = peg$parseSpace();
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$parseSpace();
                }
                if (s7 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s8 = peg$c20;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c21); }
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = [];
                    s10 = peg$parseSpace();
                    while (s10 !== peg$FAILED) {
                      s9.push(s10);
                      s10 = peg$parseSpace();
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parseExpression();
                      if (s10 !== peg$FAILED) {
                        peg$savedPos = s6;
                        s7 = peg$c30(s4, s10);
                        s6 = s7;
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c31(s4, s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parseSpace();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parseSpace();
              }
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 125) {
                  s5 = peg$c37;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c38); }
                }
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c39(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }


      /*
      @version 3
      */


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();
