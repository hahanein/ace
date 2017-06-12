/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
    // var GolangHighlightRules = require("./golang_highlight_rules").GolangHighlightRules;

    var GolangHighlightRules = function() {
        var keywords = ("if|else|end|range|template|block|define|with");
        var builtinFunctions = (
          "and|call|html|index|js|len|not|or|print|printf|println|urlquery" +
          "eq|ne|lt|le|gt|ge"
        );
        var builtinConstants = ("nil|true|false|iota");

        var keywordMapper = this.createKeywordMapper({
          "keyword": keywords,
          "constant.language": builtinConstants,
          "support.function": builtinFunctions
        });

      this.$rules = {
        "start": [
          {
            token: "string",
            regex: /"(?:[^"\\]|\\.)*?"/
          }
        ],
      }
    };

    var HtmlGolangHighlightRules = function() {
        HtmlHighlightRules.call(this);

        var startRules = [
            {
                token : "comment.start.tmpl",
                regex : "{{\/\*",
                push  : [{
                    token : "comment.end.tmpl",
                    regex: "\*\/}}",
                    next: "pop",
                    defaultToken:"comment"
                }]
            }, {
                token : "support.golang_tag",
                regex : "{{",
                push  : "golang-start"
            }
        ];

        var endRules = [
            {
                token : "support.golang_tag",
                regex : "}}",
                next  : "pop"
            }, {
                token: "comment",
                regex: "\/\*(?s:.)*\*\/"
            }
        ];

        for (var key in this.$rules)
            this.$rules[key].unshift.apply(this.$rules[key], startRules);

        this.embedRules(GolangHighlightRules, "golang-", endRules, ["start"]);

        this.normalizeRules();
    };


    oop.inherits(HtmlGolangHighlightRules, HtmlHighlightRules);

    exports.HtmlGolangHighlightRules = HtmlGolangHighlightRules;
});
