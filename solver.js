"object" == typeof exports && (module.exports = require("./main")),
  (function a(n, o, h) {
    function l(e, t) {
      if (!o[e]) {
        if (!n[e]) {
          var i = "function" == typeof require && require;
          if (!t && i) return i(e, !0);
          if (u) return u(e, !0);
          var r = new Error("Cannot find module '" + e + "'");
          throw ((r.code = "MODULE_NOT_FOUND"), r);
        }
        var s = (o[e] = { exports: {} });
        n[e][0].call(
          s.exports,
          function (t) {
            return l(n[e][1][t] || t);
          },
          s,
          s.exports,
          a,
          n,
          o,
          h
        );
      }
      return o[e].exports;
    }

    for (
      var u = "function" == typeof require && require, t = 0;
      t < h.length;
      t++
    )
      l(h[t]);
    return l;
  })(
    {
      1: [function (t, e, i) {}, {}],
      2: [
        function (t, e, i) {
          e.exports = function (t) {
            return t.length
              ? (function (t) {
                  var e = {
                      is_blank: /^\W{0,}$/,
                      is_objective: /(max|min)(imize){0,}\:/i,
                      is_int: /^(?!\/\*)\W{0,}int/i,
                      is_bin: /^(?!\/\*)\W{0,}bin/i,
                      is_constraint: /(\>|\<){0,}\=/i,
                      is_unrestricted: /^\S{0,}unrestricted/i,
                      parse_lhs: /(\-|\+){0,1}\s{0,1}\d{0,}\.{0,}\d{0,}\s{0,}[A-Za-z]\S{0,}/gi,
                      parse_rhs: /(\-|\+){0,1}\d{1,}\.{0,}\d{0,}\W{0,}\;{0,1}$/i,
                      parse_dir: /(\>|\<){0,}\=/gi,
                      parse_int: /[^\s|^\,]+/gi,
                      parse_bin: /[^\s|^\,]+/gi,
                      get_num: /(\-|\+){0,1}(\W|^)\d+\.{0,1}\d{0,}/g,
                      get_word: /[A-Za-z].*/,
                    },
                    i = {
                      opType: "",
                      optimize: "_obj",
                      constraints: {},
                      variables: {},
                    },
                    r = { ">=": "min", "<=": "max", "=": "equal" },
                    s = "",
                    a = null,
                    n = "",
                    o = "",
                    h = "",
                    l = 0;
                  "string" == typeof t && (t = t.split("\n"));
                  for (var u = 0; u < t.length; u++)
                    if (
                      ((h = "__" + u),
                      (s = t[u]),
                      0,
                      (a = null),
                      e.is_objective.test(s))
                    )
                      (i.opType = s.match(/(max|min)/gi)[0]),
                        (a = s
                          .match(e.parse_lhs)
                          .map(function (t) {
                            return t.replace(/\s+/, "");
                          })
                          .slice(1)).forEach(function (t) {
                          (n =
                            null === (n = t.match(e.get_num))
                              ? "-" === t.substr(0, 1)
                                ? -1
                                : 1
                              : n[0]),
                            (n = parseFloat(n)),
                            (o = t.match(e.get_word)[0].replace(/\;$/, "")),
                            (i.variables[o] = i.variables[o] || {}),
                            (i.variables[o]._obj = n);
                        });
                    else if (e.is_int.test(s))
                      (a = s.match(e.parse_int).slice(1)),
                        (i.ints = i.ints || {}),
                        a.forEach(function (t) {
                          (t = t.replace(";", "")), (i.ints[t] = 1);
                        });
                    else if (e.is_bin.test(s))
                      (a = s.match(e.parse_bin).slice(1)),
                        (i.binaries = i.binaries || {}),
                        a.forEach(function (t) {
                          (t = t.replace(";", "")), (i.binaries[t] = 1);
                        });
                    else if (e.is_constraint.test(s)) {
                      var d = s.indexOf(":");
                      (a = (-1 === d ? s : s.slice(d + 1))
                        .match(e.parse_lhs)
                        .map(function (t) {
                          return t.replace(/\s+/, "");
                        })).forEach(function (t) {
                        (n =
                          null === (n = t.match(e.get_num))
                            ? "-" === t.substr(0, 1)
                              ? -1
                              : 1
                            : n[0]),
                          (n = parseFloat(n)),
                          (o = t.match(e.get_word)[0]),
                          (i.variables[o] = i.variables[o] || {}),
                          (i.variables[o][h] = n);
                      }),
                        (l = parseFloat(s.match(e.parse_rhs)[0])),
                        (s = r[s.match(e.parse_dir)[0]]),
                        (i.constraints[h] = i.constraints[h] || {}),
                        (i.constraints[h][s] = l);
                    } else
                      e.is_unrestricted.test(s) &&
                        ((a = s.match(e.parse_int).slice(1)),
                        (i.unrestricted = i.unrestricted || {}),
                        a.forEach(function (t) {
                          (t = t.replace(";", "")), (i.unrestricted[t] = 1);
                        }));
                  return i;
                })(t)
              : (function (t) {
                  if (!t)
                    throw new Error("Solver requires a model to operate on");
                  var e = "",
                    i = { max: "<=", min: ">=", equal: "=" },
                    r = new RegExp("[^A-Za-z0-9_[{}/.&#$%~'@^]", "gi");
                  if (t.opType)
                    for (var s in ((e += t.opType + ":"), t.variables))
                      (t.variables[s][s] = t.variables[s][s]
                        ? t.variables[s][s]
                        : 1),
                        t.variables[s][t.optimize] &&
                          (e +=
                            " " +
                            t.variables[s][t.optimize] +
                            " " +
                            s.replace(r, "_"));
                  else e += "max:";
                  for (var a in ((e += ";\n\n"), t.constraints))
                    for (var n in t.constraints[a])
                      if (void 0 !== i[n]) {
                        for (var o in t.variables)
                          void 0 !== t.variables[o][a] &&
                            (e +=
                              " " +
                              t.variables[o][a] +
                              " " +
                              o.replace(r, "_"));
                        (e += " " + i[n] + " " + t.constraints[a][n]),
                          (e += ";\n");
                      }
                  if (t.ints)
                    for (var h in ((e += "\n\n"), t.ints))
                      e += "int " + h.replace(r, "_") + ";\n";
                  if (t.unrestricted)
                    for (var l in ((e += "\n\n"), t.unrestricted))
                      e += "unrestricted " + l.replace(r, "_") + ";\n";
                  return e;
                })(t);
          };
        },
        {},
      ],
      3: [
        function (n, t, e) {
          function o(t) {
            return (t = (t = (t = t.replace("\\r\\n", "\r\n")).split("\r\n"))
              .filter(function (t) {
                return (
                  !0 !== new RegExp(" 0$", "gi").test(t) &&
                  !1 !== new RegExp("\\d$", "gi").test(t)
                );
              })
              .map(function (t) {
                return t.split(/\:{0,1} +(?=\d)/);
              })
              .reduce(function (t, e, i) {
                return (t[e[0]] = e[1]), t;
              }, {}));
          }

          (e.reformat = n("./Reformat.js")),
            (e.solve = function (a) {
              return new Promise(function (r, s) {
                "undefined" != typeof window &&
                  s("Function Not Available in Browser");
                var t = n("./Reformat.js")(a);
                a.external ||
                  s(
                    "Data for this function must be contained in the 'external' attribute. Not seeing anything there."
                  ),
                  a.external.binPath ||
                    s(
                      "No Executable | Binary path provided in arguments as 'binPath'"
                    ),
                  a.external.args ||
                    s(
                      "No arguments array for cli | bash provided on 'args' attribute"
                    ),
                  a.external.tempName ||
                    s(
                      "No 'tempName' given. This is necessary to produce a staging file for the solver to operate on"
                    ),
                  n("fs").writeFile(a.external.tempName, t, function (t, e) {
                    if (t) s(t);
                    else {
                      var i = n("child_process").execFile;
                      a.external.args.push(a.external.tempName),
                        i(a.external.binPath, a.external.args, function (t, e) {
                          if (t)
                            if (1 === t.code) r(o(e));
                            else {
                              var i = {
                                code: t.code,
                                meaning: {
                                  "-2": "Out of Memory",
                                  1: "SUBOPTIMAL",
                                  2: "INFEASIBLE",
                                  3: "UNBOUNDED",
                                  4: "DEGENERATE",
                                  5: "NUMFAILURE",
                                  6: "USER-ABORT",
                                  7: "TIMEOUT",
                                  9: "PRESOLVED",
                                  25: "ACCURACY ERROR",
                                  255: "FILE-ERROR",
                                }[t.code],
                                data: e,
                              };
                              s(i);
                            }
                          else r(o(e));
                        });
                    }
                  });
              });
            });
        },
        { "./Reformat.js": 2, child_process: 1, fs: 1 },
      ],
      4: [
        function (t, e, i) {
          e.exports = { lpsolve: t("./lpsolve/main.js") };
        },
        { "./lpsolve/main.js": 3 },
      ],
      5: [
        function (t, e, i) {
          var r = t("./Tableau/Tableau.js"),
            s = (t("./Tableau/branchAndCut.js"), t("./expressions.js")),
            a = s.Constraint,
            F = s.Equality,
            o = s.Variable,
            h = s.IntegerVariable;
          s.Term;

          function n(t, e) {
            (this.tableau = new r(t)),
              (this.name = e),
              (this.variables = []),
              (this.integerVariables = []),
              (this.unrestrictedVariables = {}),
              (this.constraints = []),
              (this.nConstraints = 0),
              (this.nVariables = 0),
              (this.isMinimization = !0),
              (this.tableauInitialized = !1),
              (this.relaxationIndex = 1),
              (this.useMIRCuts = !1),
              (this.checkForCycles = !0),
              (this.messages = []);
          }

          ((e.exports = n).prototype.minimize = function () {
            return (this.isMinimization = !0), this;
          }),
            (n.prototype.maximize = function () {
              return (this.isMinimization = !1), this;
            }),
            (n.prototype._getNewElementIndex = function () {
              if (0 < this.availableIndexes.length)
                return this.availableIndexes.pop();
              var t = this.lastElementIndex;
              return (this.lastElementIndex += 1), t;
            }),
            (n.prototype._addConstraint = function (t) {
              var e = t.slack;
              (this.tableau.variablesPerIndex[e.index] = e),
                this.constraints.push(t),
                (this.nConstraints += 1),
                !0 === this.tableauInitialized && this.tableau.addConstraint(t);
            }),
            (n.prototype.smallerThan = function (t) {
              var e = new a(t, !0, this.tableau.getNewElementIndex(), this);
              return this._addConstraint(e), e;
            }),
            (n.prototype.greaterThan = function (t) {
              var e = new a(t, !1, this.tableau.getNewElementIndex(), this);
              return this._addConstraint(e), e;
            }),
            (n.prototype.equal = function (t) {
              var e = new a(t, !0, this.tableau.getNewElementIndex(), this);
              this._addConstraint(e);
              var i = new a(t, !1, this.tableau.getNewElementIndex(), this);
              return this._addConstraint(i), new F(e, i);
            }),
            (n.prototype.addVariable = function (t, e, i, r, s) {
              if ("string" == typeof s)
                switch (s) {
                  case "required":
                    s = 0;
                    break;
                  case "strong":
                    s = 1;
                    break;
                  case "medium":
                    s = 2;
                    break;
                  case "weak":
                    s = 3;
                    break;
                  default:
                    s = 0;
                }
              var a,
                n = this.tableau.getNewElementIndex();
              return (
                null == e && (e = "v" + n),
                null == t && (t = 0),
                null == s && (s = 0),
                i
                  ? ((a = new h(e, t, n, s)), this.integerVariables.push(a))
                  : (a = new o(e, t, n, s)),
                this.variables.push(a),
                (this.tableau.variablesPerIndex[n] = a),
                r && (this.unrestrictedVariables[n] = !0),
                (this.nVariables += 1),
                !0 === this.tableauInitialized && this.tableau.addVariable(a),
                a
              );
            }),
            (n.prototype._removeConstraint = function (t) {
              var e = this.constraints.indexOf(t);
              -1 !== e
                ? (this.constraints.splice(e, 1),
                  (this.nConstraints -= 1),
                  !0 === this.tableauInitialized &&
                    this.tableau.removeConstraint(t),
                  t.relaxation && this.removeVariable(t.relaxation))
                : console.warn(
                    "[Model.removeConstraint] Constraint not present in model"
                  );
            }),
            (n.prototype.removeConstraint = function (t) {
              return (
                t.isEquality
                  ? (this._removeConstraint(t.upperBound),
                    this._removeConstraint(t.lowerBound))
                  : this._removeConstraint(t),
                this
              );
            }),
            (n.prototype.removeVariable = function (t) {
              var e = this.variables.indexOf(t);
              if (-1 !== e)
                return (
                  this.variables.splice(e, 1),
                  !0 === this.tableauInitialized &&
                    this.tableau.removeVariable(t),
                  this
                );
              console.warn(
                "[Model.removeVariable] Variable not present in model"
              );
            }),
            (n.prototype.updateRightHandSide = function (t, e) {
              return (
                !0 === this.tableauInitialized &&
                  this.tableau.updateRightHandSide(t, e),
                this
              );
            }),
            (n.prototype.updateConstraintCoefficient = function (t, e, i) {
              return (
                !0 === this.tableauInitialized &&
                  this.tableau.updateConstraintCoefficient(t, e, i),
                this
              );
            }),
            (n.prototype.setCost = function (t, e) {
              var i = t - e.cost;
              return (
                !1 === this.isMinimization && (i = -i),
                (e.cost = t),
                this.tableau.updateCost(e, i),
                this
              );
            }),
            (n.prototype.loadJson = function (t) {
              this.isMinimization = "max" !== t.opType;
              for (
                var e = t.variables,
                  i = t.constraints,
                  r = {},
                  s = {},
                  a = Object.keys(i),
                  n = a.length,
                  o = 0;
                o < n;
                o += 1
              ) {
                var h,
                  l,
                  u = a[o],
                  d = i[u],
                  c = d.equal,
                  v = d.weight,
                  p = d.priority,
                  f = void 0 !== v || void 0 !== p;
                if (void 0 === c) {
                  var x = d.min;
                  void 0 !== x &&
                    ((h = this.greaterThan(x)), (r[u] = h), f && h.relax(v, p));
                  var b = d.max;
                  void 0 !== b &&
                    ((l = this.smallerThan(b)), (s[u] = l), f && l.relax(v, p));
                } else {
                  (h = this.greaterThan(c)),
                    (r[u] = h),
                    (l = this.smallerThan(c)),
                    (s[u] = l);
                  var m = new F(h, l);
                  f && m.relax(v, p);
                }
              }
              var y = Object.keys(e),
                I = y.length;
              (this.tolerance = t.tolerance || 0),
                t.timeout && (this.timeout = t.timeout),
                t.options &&
                  (t.options.timeout && (this.timeout = t.options.timeout),
                  0 === this.tolerance &&
                    (this.tolerance = t.options.tolerance || 0),
                  t.options.useMIRCuts &&
                    (this.useMIRCuts = t.options.useMIRCuts),
                  void 0 === t.options.exitOnCycles
                    ? (this.checkForCycles = !0)
                    : (this.checkForCycles = t.options.exitOnCycles));
              for (
                var g = t.ints || {},
                  w = t.binaries || {},
                  C = t.unrestricted || {},
                  B = t.optimize,
                  V = 0;
                V < I;
                V += 1
              ) {
                var j = y[V],
                  O = e[j],
                  R = O[B] || 0,
                  M = !!w[j],
                  E = !!g[j] || M,
                  _ = !!C[j],
                  T = this.addVariable(R, j, E, _);
                M && this.smallerThan(1).addTerm(1, T);
                var S = Object.keys(O);
                for (o = 0; o < S.length; o += 1) {
                  var z = S[o];
                  if (z !== B) {
                    var P = O[z],
                      N = r[z];
                    void 0 !== N && N.addTerm(P, T);
                    var k = s[z];
                    void 0 !== k && k.addTerm(P, T);
                  }
                }
              }
              return this;
            }),
            (n.prototype.getNumberOfIntegerVariables = function () {
              return this.integerVariables.length;
            }),
            (n.prototype.solve = function () {
              return (
                !1 === this.tableauInitialized &&
                  (this.tableau.setModel(this), (this.tableauInitialized = !0)),
                this.tableau.solve()
              );
            }),
            (n.prototype.isFeasible = function () {
              return this.tableau.feasible;
            }),
            (n.prototype.save = function () {
              return this.tableau.save();
            }),
            (n.prototype.restore = function () {
              return this.tableau.restore();
            }),
            (n.prototype.activateMIRCuts = function (t) {
              this.useMIRCuts = t;
            }),
            (n.prototype.debug = function (t) {
              this.checkForCycles = t;
            }),
            (n.prototype.log = function (t) {
              return this.tableau.log(t);
            });
        },
        {
          "./Tableau/Tableau.js": 9,
          "./Tableau/branchAndCut.js": 11,
          "./expressions.js": 20,
        },
      ],
      6: [
        function (t, e, i) {
          e.exports = function (t, e) {
            var i,
              r,
              s,
              a,
              n,
              o = e.optimize,
              h = JSON.parse(JSON.stringify(e.optimize)),
              l = Object.keys(e.optimize),
              u = 0,
              d = {},
              c = "",
              v = {},
              p = [];
            for (delete e.optimize, r = 0; r < l.length; r++) h[l[r]] = 0;
            for (r = 0; r < l.length; r++) {
              for (n in ((e.optimize = l[r]),
              (e.opType = o[l[r]]),
              (i = t.Solve(e, void 0, void 0, !0)),
              l))
                if (!e.variables[l[n]])
                  for (a in ((i[l[n]] = i[l[n]] ? i[l[n]] : 0), e.variables))
                    e.variables[a][l[n]] &&
                      i[a] &&
                      (i[l[n]] += i[a] * e.variables[a][l[n]]);
              for (c = "base", s = 0; s < l.length; s++)
                i[l[s]]
                  ? (c += "-" + ((1e3 * i[l[s]]) | 0) / 1e3)
                  : (c += "-0");
              if (!d[c]) {
                for (d[c] = 1, u++, s = 0; s < l.length; s++)
                  i[l[s]] && (h[l[s]] += i[l[s]]);
                delete i.feasible, delete i.result, p.push(i);
              }
            }
            for (r = 0; r < l.length; r++)
              e.constraints[l[r]] = { equal: h[l[r]] / u };
            for (r in ((e.optimize = "cheater-" + Math.random()),
            (e.opType = "max"),
            e.variables))
              e.variables[r].cheater = 1;
            for (r in p)
              for (a in p[r]) v[a] = v[a] || { min: 1e99, max: -1e99 };
            for (r in v)
              for (a in p)
                p[a][r]
                  ? (p[a][r] > v[r].max && (v[r].max = p[a][r]),
                    p[a][r] < v[r].min && (v[r].min = p[a][r]))
                  : ((p[a][r] = 0), (v[r].min = 0));
            return {
              midpoint: (i = t.Solve(e, void 0, void 0, !0)),
              vertices: p,
              ranges: v,
            };
          };
        },
        {},
      ],
      7: [
        function (t, e, i) {
          var a = t("./Solution.js");

          function r(t, e, i, r, s) {
            a.call(this, t, e, i, r), (this.iter = s);
          }

          ((e.exports = r).prototype = Object.create(a.prototype)),
            (r.constructor = r);
        },
        { "./Solution.js": 8 },
      ],
      8: [
        function (t, e, i) {
          function r(t, e, i, r) {
            (this.feasible = i),
              (this.evaluation = e),
              (this.bounded = r),
              (this._tableau = t);
          }

          (e.exports = r).prototype.generateSolutionSet = function () {
            for (
              var t = {},
                e = this._tableau,
                i = e.varIndexByRow,
                r = e.variablesPerIndex,
                s = e.matrix,
                a = e.rhsColumn,
                n = e.height - 1,
                o = Math.round(1 / e.precision),
                h = 1;
              h <= n;
              h += 1
            ) {
              var l = r[i[h]];
              if (void 0 !== l && !0 !== l.isSlack) {
                var u = s[h][a];
                t[l.id] = Math.round((Number.EPSILON + u) * o) / o;
              }
            }
            return t;
          };
        },
        {},
      ],
      9: [
        function (t, e, i) {
          var r = t("./Solution.js"),
            s = t("./MilpSolution.js");

          function a(t) {
            (this.model = null),
              (this.matrix = null),
              (this.width = 0),
              (this.height = 0),
              (this.costRowIndex = 0),
              (this.rhsColumn = 0),
              (this.variablesPerIndex = []),
              (this.unrestrictedVars = null),
              (this.feasible = !0),
              (this.evaluation = 0),
              (this.simplexIters = 0),
              (this.varIndexByRow = null),
              (this.varIndexByCol = null),
              (this.rowByVarIndex = null),
              (this.colByVarIndex = null),
              (this.precision = t || 1e-8),
              (this.optionalObjectives = []),
              (this.objectivesByPriority = {}),
              (this.savedState = null),
              (this.availableIndexes = []),
              (this.lastElementIndex = 0),
              (this.variables = null),
              (this.nVars = 0),
              (this.bounded = !0),
              (this.unboundedVarIndex = null),
              (this.branchAndCutIterations = 0);
          }

          function n(t, e) {
            (this.priority = t), (this.reducedCosts = new Array(e));
            for (var i = 0; i < e; i += 1) this.reducedCosts[i] = 0;
          }

          ((e.exports = a).prototype.solve = function () {
            return (
              0 < this.model.getNumberOfIntegerVariables()
                ? this.branchAndCut()
                : this.simplex(),
              this.updateVariableValues(),
              this.getSolution()
            );
          }),
            (n.prototype.copy = function () {
              var t = new n(this.priority, this.reducedCosts.length);
              return (t.reducedCosts = this.reducedCosts.slice()), t;
            }),
            (a.prototype.setOptionalObjective = function (t, e, i) {
              var r = this.objectivesByPriority[t];
              void 0 === r &&
                ((r = new n(t, Math.max(this.width, e + 1))),
                (this.objectivesByPriority[t] = r),
                this.optionalObjectives.push(r),
                this.optionalObjectives.sort(function (t, e) {
                  return t.priority - e.priority;
                }));
              r.reducedCosts[e] = i;
            }),
            (a.prototype.initialize = function (t, e, i, r) {
              (this.variables = i),
                (this.unrestrictedVars = r),
                (this.width = t),
                (this.height = e);
              for (var s = new Array(t), a = 0; a < t; a++) s[a] = 0;
              this.matrix = new Array(e);
              for (var n = 0; n < e; n++) this.matrix[n] = s.slice();
              (this.varIndexByRow = new Array(this.height)),
                (this.varIndexByCol = new Array(this.width)),
                (this.varIndexByRow[0] = -1),
                (this.varIndexByCol[0] = -1),
                (this.nVars = t + e - 2),
                (this.rowByVarIndex = new Array(this.nVars)),
                (this.colByVarIndex = new Array(this.nVars)),
                (this.lastElementIndex = this.nVars);
            }),
            (a.prototype._resetMatrix = function () {
              var t,
                e,
                i = this.model.variables,
                r = this.model.constraints,
                s = i.length,
                a = r.length,
                n = this.matrix[0],
                o = !0 === this.model.isMinimization ? -1 : 1;
              for (t = 0; t < s; t += 1) {
                var h = i[t],
                  l = h.priority,
                  u = o * h.cost;
                0 === l
                  ? (n[t + 1] = u)
                  : this.setOptionalObjective(l, t + 1, u),
                  (e = i[t].index),
                  (this.rowByVarIndex[e] = -1),
                  (this.colByVarIndex[e] = t + 1),
                  (this.varIndexByCol[t + 1] = e);
              }
              for (var d = 1, c = 0; c < a; c += 1) {
                var v,
                  p,
                  f = r[c],
                  x = f.index;
                (this.rowByVarIndex[x] = d),
                  (this.colByVarIndex[x] = -1),
                  (this.varIndexByRow[d] = x);
                var b = f.terms,
                  m = b.length,
                  y = this.matrix[d++];
                if (f.isUpperBound) {
                  for (v = 0; v < m; v += 1)
                    (p = b[v]),
                      (y[this.colByVarIndex[p.variable.index]] = p.coefficient);
                  y[0] = f.rhs;
                } else {
                  for (v = 0; v < m; v += 1)
                    (p = b[v]),
                      (y[
                        this.colByVarIndex[p.variable.index]
                      ] = -p.coefficient);
                  y[0] = -f.rhs;
                }
              }
            }),
            (a.prototype.setModel = function (t) {
              var e = (this.model = t).nVariables + 1,
                i = t.nConstraints + 1;
              return (
                this.initialize(e, i, t.variables, t.unrestrictedVariables),
                this._resetMatrix(),
                this
              );
            }),
            (a.prototype.getNewElementIndex = function () {
              if (0 < this.availableIndexes.length)
                return this.availableIndexes.pop();
              var t = this.lastElementIndex;
              return (this.lastElementIndex += 1), t;
            }),
            (a.prototype.density = function () {
              for (var t = 0, e = this.matrix, i = 0; i < this.height; i++)
                for (var r = e[i], s = 0; s < this.width; s++)
                  0 !== r[s] && (t += 1);
              return t / (this.height * this.width);
            }),
            (a.prototype.setEvaluation = function () {
              var t = Math.round(1 / this.precision),
                e = this.matrix[this.costRowIndex][this.rhsColumn],
                i = Math.round((Number.EPSILON + e) * t) / t;
              (this.evaluation = i),
                0 === this.simplexIters && (this.bestPossibleEval = i);
            }),
            (a.prototype.getSolution = function () {
              var t =
                !0 === this.model.isMinimization
                  ? this.evaluation
                  : -this.evaluation;
              return 0 < this.model.getNumberOfIntegerVariables()
                ? new s(
                    this,
                    t,
                    this.feasible,
                    this.bounded,
                    this.branchAndCutIterations
                  )
                : new r(this, t, this.feasible, this.bounded);
            });
        },
        { "./MilpSolution.js": 7, "./Solution.js": 8 },
      ],
      10: [
        function (t, e, i) {
          var n = t("./Tableau.js");
          (n.prototype.copy = function () {
            var t = new n(this.precision);
            (t.width = this.width),
              (t.height = this.height),
              (t.nVars = this.nVars),
              (t.model = this.model),
              (t.variables = this.variables),
              (t.variablesPerIndex = this.variablesPerIndex),
              (t.unrestrictedVars = this.unrestrictedVars),
              (t.lastElementIndex = this.lastElementIndex),
              (t.varIndexByRow = this.varIndexByRow.slice()),
              (t.varIndexByCol = this.varIndexByCol.slice()),
              (t.rowByVarIndex = this.rowByVarIndex.slice()),
              (t.colByVarIndex = this.colByVarIndex.slice()),
              (t.availableIndexes = this.availableIndexes.slice());
            for (var e = [], i = 0; i < this.optionalObjectives.length; i++)
              e[i] = this.optionalObjectives[i].copy();
            t.optionalObjectives = e;
            for (
              var r = this.matrix, s = new Array(this.height), a = 0;
              a < this.height;
              a++
            )
              s[a] = r[a].slice();
            return (t.matrix = s), t;
          }),
            (n.prototype.save = function () {
              this.savedState = this.copy();
            }),
            (n.prototype.restore = function () {
              if (null !== this.savedState) {
                var t,
                  e,
                  i = this.savedState,
                  r = i.matrix;
                for (
                  this.nVars = i.nVars,
                    this.model = i.model,
                    this.variables = i.variables,
                    this.variablesPerIndex = i.variablesPerIndex,
                    this.unrestrictedVars = i.unrestrictedVars,
                    this.lastElementIndex = i.lastElementIndex,
                    this.width = i.width,
                    this.height = i.height,
                    t = 0;
                  t < this.height;
                  t += 1
                ) {
                  var s = r[t],
                    a = this.matrix[t];
                  for (e = 0; e < this.width; e += 1) a[e] = s[e];
                }
                var n = i.varIndexByRow;
                for (e = 0; e < this.height; e += 1)
                  this.varIndexByRow[e] = n[e];
                for (; this.varIndexByRow.length > this.height; )
                  this.varIndexByRow.pop();
                var o = i.varIndexByCol;
                for (t = 0; t < this.width; t += 1)
                  this.varIndexByCol[t] = o[t];
                for (; this.varIndexByCol.length > this.width; )
                  this.varIndexByCol.pop();
                for (
                  var h = i.rowByVarIndex, l = i.colByVarIndex, u = 0;
                  u < this.nVars;
                  u += 1
                )
                  (this.rowByVarIndex[u] = h[u]),
                    (this.colByVarIndex[u] = l[u]);
                if (
                  0 < i.optionalObjectives.length &&
                  0 < this.optionalObjectives.length
                ) {
                  (this.optionalObjectives = []),
                    (this.optionalObjectivePerPriority = {});
                  for (var d = 0; d < i.optionalObjectives.length; d++) {
                    var c = i.optionalObjectives[d].copy();
                    (this.optionalObjectives[d] = c),
                      (this.optionalObjectivePerPriority[c.priority] = c);
                  }
                }
              }
            });
        },
        { "./Tableau.js": 9 },
      ],
      11: [
        function (t, e, i) {
          var r = t("./Tableau.js");

          function O(t, e, i) {
            (this.type = t), (this.varIndex = e), (this.value = i);
          }

          function R(t, e) {
            (this.relaxedEvaluation = t), (this.cuts = e);
          }

          function M(t, e) {
            return e.relaxedEvaluation - t.relaxedEvaluation;
          }

          (r.prototype.applyCuts = function (t) {
            if (
              (this.restore(),
              this.addCutConstraints(t),
              this.simplex(),
              this.model.useMIRCuts)
            )
              for (var e = !0; e; ) {
                var i = this.computeFractionalVolume(!0);
                this.applyMIRCuts(),
                  this.simplex(),
                  0.9 * i <= this.computeFractionalVolume(!0) && (e = !1);
              }
          }),
            (r.prototype.branchAndCut = function () {
              var t = [],
                e = 0,
                i = this.model.tolerance,
                r = !0,
                s = 1e99;
              this.model.timeout && (s = Date.now() + this.model.timeout);
              for (
                var a = 1 / 0, n = null, o = [], h = 0;
                h < this.optionalObjectives.length;
                h += 1
              )
                o.push(1 / 0);
              var l,
                u = new R(-1 / 0, []);
              for (t.push(u); 0 < t.length && !0 === r && Date.now() < s; )
                if (
                  ((l = this.model.isMinimization
                    ? this.bestPossibleEval * (1 + i)
                    : this.bestPossibleEval * (1 - i)),
                  0 < i && a < l && (r = !1),
                  !((u = t.pop()).relaxedEvaluation > a))
                ) {
                  var d = u.cuts;
                  if ((this.applyCuts(d), e++, !1 !== this.feasible)) {
                    var c = this.evaluation;
                    if (!(a < c)) {
                      if (c === a) {
                        for (
                          var v = !0, p = 0;
                          p < this.optionalObjectives.length &&
                          !(this.optionalObjectives[p].reducedCosts[0] > o[p]);
                          p += 1
                        )
                          if (
                            this.optionalObjectives[p].reducedCosts[0] < o[p]
                          ) {
                            v = !1;
                            break;
                          }
                        if (v) continue;
                      }
                      if (!0 === this.isIntegral()) {
                        if (((this.__isIntegral = !0), 1 === e))
                          return void (this.branchAndCutIterations = e);
                        (n = u), (a = c);
                        for (
                          var f = 0;
                          f < this.optionalObjectives.length;
                          f += 1
                        )
                          o[f] = this.optionalObjectives[f].reducedCosts[0];
                      } else {
                        1 === e && this.save();
                        for (
                          var x = this.getMostFractionalVar(),
                            b = x.index,
                            m = [],
                            y = [],
                            I = d.length,
                            g = 0;
                          g < I;
                          g += 1
                        ) {
                          var w = d[g];
                          w.varIndex === b
                            ? "min" === w.type
                              ? y.push(w)
                              : m.push(w)
                            : (m.push(w), y.push(w));
                        }
                        var C = Math.ceil(x.value),
                          B = Math.floor(x.value),
                          V = new O("min", b, C);
                        m.push(V);
                        var j = new O("max", b, B);
                        y.push(j),
                          t.push(new R(c, m)),
                          t.push(new R(c, y)),
                          t.sort(M);
                      }
                    }
                  }
                }
              null !== n && this.applyCuts(n.cuts),
                (this.branchAndCutIterations = e);
            });
        },
        { "./Tableau.js": 9 },
      ],
      12: [
        function (t, e, i) {
          var r = t("./Tableau.js");

          function d(t, e) {
            (this.index = t), (this.value = e);
          }

          (r.prototype.getMostFractionalVar = function () {
            for (
              var t = 0,
                e = null,
                i = null,
                r = this.model.integerVariables,
                s = r.length,
                a = 0;
              a < s;
              a++
            ) {
              var n = r[a].index,
                o = this.rowByVarIndex[n];
              if (-1 !== o) {
                var h = this.matrix[o][this.rhsColumn],
                  l = Math.abs(h - Math.round(h));
                t < l && ((t = l), (e = n), (i = h));
              }
            }
            return new d(e, i);
          }),
            (r.prototype.getFractionalVarWithLowestCost = function () {
              for (
                var t = 1 / 0,
                  e = null,
                  i = null,
                  r = this.model.integerVariables,
                  s = r.length,
                  a = 0;
                a < s;
                a++
              ) {
                var n = r[a],
                  o = n.index,
                  h = this.rowByVarIndex[o];
                if (-1 !== h) {
                  var l = this.matrix[h][this.rhsColumn];
                  if (Math.abs(l - Math.round(l)) > this.precision) {
                    var u = n.cost;
                    u < t && ((t = u), (e = o), (i = l));
                  }
                }
              }
              return new d(e, i);
            });
        },
        { "./Tableau.js": 9 },
      ],
      13: [
        function (t, e, i) {
          var r = t("./Tableau.js"),
            b = t("../expressions.js").SlackVariable;
          (r.prototype.addCutConstraints = function (t) {
            for (
              var e, i = t.length, r = this.height, s = r + i, a = r;
              a < s;
              a += 1
            )
              void 0 === this.matrix[a] &&
                (this.matrix[a] = this.matrix[a - 1].slice());
            (this.height = s), (this.nVars = this.width + this.height - 2);
            for (var n = this.width - 1, o = 0; o < i; o += 1) {
              var h = t[o],
                l = r + o,
                u = "min" === h.type ? -1 : 1,
                d = h.varIndex,
                c = this.rowByVarIndex[d],
                v = this.matrix[l];
              if (-1 === c) {
                for (v[this.rhsColumn] = u * h.value, e = 1; e <= n; e += 1)
                  v[e] = 0;
                v[this.colByVarIndex[d]] = u;
              } else {
                var p = this.matrix[c],
                  f = p[this.rhsColumn];
                for (
                  v[this.rhsColumn] = u * (h.value - f), e = 1;
                  e <= n;
                  e += 1
                )
                  v[e] = -u * p[e];
              }
              var x = this.getNewElementIndex();
              (this.varIndexByRow[l] = x),
                (this.rowByVarIndex[x] = l),
                (this.colByVarIndex[x] = -1),
                (this.variablesPerIndex[x] = new b("s" + x, x)),
                (this.nVars += 1);
            }
          }),
            (r.prototype._addLowerBoundMIRCut = function (t) {
              if (t === this.costRowIndex) return !1;
              this.model;
              var e = this.matrix;
              if (!this.variablesPerIndex[this.varIndexByRow[t]].isInteger)
                return !1;
              var i = e[t][this.rhsColumn],
                r = i - Math.floor(i);
              if (r < this.precision || 1 - this.precision < r) return !1;
              var s = this.height;
              (e[s] = e[s - 1].slice()), (this.height += 1), (this.nVars += 1);
              var a = this.getNewElementIndex();
              (this.varIndexByRow[s] = a),
                (this.rowByVarIndex[a] = s),
                (this.colByVarIndex[a] = -1),
                (this.variablesPerIndex[a] = new b("s" + a, a)),
                (e[s][this.rhsColumn] = Math.floor(i));
              for (var n = 1; n < this.varIndexByCol.length; n += 1) {
                if (this.variablesPerIndex[this.varIndexByCol[n]].isInteger) {
                  var o = e[t][n],
                    h =
                      Math.floor(o) +
                      Math.max(0, o - Math.floor(o) - r) / (1 - r);
                  e[s][n] = h;
                } else e[s][n] = Math.min(0, e[t][n] / (1 - r));
              }
              for (var l = 0; l < this.width; l += 1) e[s][l] -= e[t][l];
              return !0;
            }),
            (r.prototype._addUpperBoundMIRCut = function (t) {
              if (t === this.costRowIndex) return !1;
              this.model;
              var e = this.matrix;
              if (!this.variablesPerIndex[this.varIndexByRow[t]].isInteger)
                return !1;
              var i = e[t][this.rhsColumn],
                r = i - Math.floor(i);
              if (r < this.precision || 1 - this.precision < r) return !1;
              var s = this.height;
              (e[s] = e[s - 1].slice()), (this.height += 1), (this.nVars += 1);
              var a = this.getNewElementIndex();
              (this.varIndexByRow[s] = a),
                (this.rowByVarIndex[a] = s),
                (this.colByVarIndex[a] = -1),
                (this.variablesPerIndex[a] = new b("s" + a, a)),
                (e[s][this.rhsColumn] = -r);
              for (var n = 1; n < this.varIndexByCol.length; n += 1) {
                var o = this.variablesPerIndex[this.varIndexByCol[n]],
                  h = e[t][n],
                  l = h - Math.floor(h);
                o.isInteger
                  ? (e[s][n] = l <= r ? -l : (-(1 - l) * r) / l)
                  : (e[s][n] = 0 <= h ? -h : (h * r) / (1 - r));
              }
              return !0;
            }),
            (r.prototype.applyMIRCuts = function () {});
        },
        { "../expressions.js": 20, "./Tableau.js": 9 },
      ],
      14: [
        function (t, e, i) {
          var r = t("./Tableau.js");
          (r.prototype._putInBase = function (t) {
            var e = this.rowByVarIndex[t];
            if (-1 === e) {
              for (
                var i = this.colByVarIndex[t], r = 1;
                r < this.height;
                r += 1
              ) {
                var s = this.matrix[r][i];
                if (s < -this.precision || this.precision < s) {
                  e = r;
                  break;
                }
              }
              this.pivot(e, i);
            }
            return e;
          }),
            (r.prototype._takeOutOfBase = function (t) {
              var e = this.colByVarIndex[t];
              if (-1 === e) {
                for (
                  var i = this.rowByVarIndex[t], r = this.matrix[i], s = 1;
                  s < this.height;
                  s += 1
                ) {
                  var a = r[s];
                  if (a < -this.precision || this.precision < a) {
                    e = s;
                    break;
                  }
                }
                this.pivot(i, e);
              }
              return e;
            }),
            (r.prototype.updateVariableValues = function () {
              for (
                var t = this.variables.length,
                  e = Math.round(1 / this.precision),
                  i = 0;
                i < t;
                i += 1
              ) {
                var r = this.variables[i],
                  s = r.index,
                  a = this.rowByVarIndex[s];
                if (-1 === a) r.value = 0;
                else {
                  var n = this.matrix[a][this.rhsColumn];
                  r.value = Math.round((n + Number.EPSILON) * e) / e;
                }
              }
            }),
            (r.prototype.updateRightHandSide = function (t, e) {
              var i = this.height - 1,
                r = this.rowByVarIndex[t.index];
              if (-1 === r) {
                for (
                  var s = this.colByVarIndex[t.index], a = 0;
                  a <= i;
                  a += 1
                ) {
                  var n = this.matrix[a];
                  n[this.rhsColumn] -= e * n[s];
                }
                var o = this.optionalObjectives.length;
                if (0 < o)
                  for (var h = 0; h < o; h += 1) {
                    var l = this.optionalObjectives[h].reducedCosts;
                    l[this.rhsColumn] -= e * l[s];
                  }
              } else this.matrix[r][this.rhsColumn] -= e;
            }),
            (r.prototype.updateConstraintCoefficient = function (t, e, i) {
              if (t.index === e.index)
                throw new Error(
                  "[Tableau.updateConstraintCoefficient] constraint index should not be equal to variable index !"
                );
              var r = this._putInBase(t.index),
                s = this.colByVarIndex[e.index];
              if (-1 === s)
                for (
                  var a = this.rowByVarIndex[e.index], n = 0;
                  n < this.width;
                  n += 1
                )
                  this.matrix[r][n] += i * this.matrix[a][n];
              else this.matrix[r][s] -= i;
            }),
            (r.prototype.updateCost = function (t, e) {
              var i = t.index,
                r = this.width - 1,
                s = this.colByVarIndex[i];
              if (-1 === s) {
                var a,
                  n = this.matrix[this.rowByVarIndex[i]];
                if (0 === t.priority) {
                  var o = this.matrix[0];
                  for (a = 0; a <= r; a += 1) o[a] += e * n[a];
                } else {
                  var h = this.objectivesByPriority[t.priority].reducedCosts;
                  for (a = 0; a <= r; a += 1) h[a] += e * n[a];
                }
              } else this.matrix[0][s] -= e;
            }),
            (r.prototype.addConstraint = function (t) {
              var e = t.isUpperBound ? 1 : -1,
                i = this.height,
                r = this.matrix[i];
              void 0 === r &&
                ((r = this.matrix[0].slice()), (this.matrix[i] = r));
              for (var s = this.width - 1, a = 0; a <= s; a += 1) r[a] = 0;
              r[this.rhsColumn] = e * t.rhs;
              for (var n = t.terms, o = n.length, h = 0; h < o; h += 1) {
                var l = n[h],
                  u = l.coefficient,
                  d = l.variable.index,
                  c = this.rowByVarIndex[d];
                if (-1 === c) r[this.colByVarIndex[d]] += e * u;
                else {
                  var v = this.matrix[c];
                  v[this.rhsColumn];
                  for (a = 0; a <= s; a += 1) r[a] -= e * u * v[a];
                }
              }
              var p = t.index;
              (this.varIndexByRow[i] = p),
                (this.rowByVarIndex[p] = i),
                (this.colByVarIndex[p] = -1),
                (this.height += 1);
            }),
            (r.prototype.removeConstraint = function (t) {
              var e = t.index,
                i = this.height - 1,
                r = this._putInBase(e),
                s = this.matrix[i];
              (this.matrix[i] = this.matrix[r]),
                (this.matrix[r] = s),
                (this.varIndexByRow[r] = this.varIndexByRow[i]),
                (this.varIndexByRow[i] = -1),
                (this.rowByVarIndex[e] = -1),
                (this.availableIndexes[this.availableIndexes.length] = e),
                (t.slack.index = -1),
                (this.height -= 1);
            }),
            (r.prototype.addVariable = function (t) {
              var e = this.height - 1,
                i = this.width,
                r = !0 === this.model.isMinimization ? -t.cost : t.cost,
                s = t.priority,
                a = this.optionalObjectives.length;
              if (0 < a)
                for (var n = 0; n < a; n += 1)
                  this.optionalObjectives[n].reducedCosts[i] = 0;
              0 === s
                ? (this.matrix[0][i] = r)
                : (this.setOptionalObjective(s, i, r), (this.matrix[0][i] = 0));
              for (var o = 1; o <= e; o += 1) this.matrix[o][i] = 0;
              var h = t.index;
              (this.varIndexByCol[i] = h),
                (this.rowByVarIndex[h] = -1),
                (this.colByVarIndex[h] = i),
                (this.width += 1);
            }),
            (r.prototype.removeVariable = function (t) {
              var e = t.index,
                i = this._takeOutOfBase(e),
                r = this.width - 1;
              if (i !== r) {
                for (var s = this.height - 1, a = 0; a <= s; a += 1) {
                  var n = this.matrix[a];
                  n[i] = n[r];
                }
                var o = this.optionalObjectives.length;
                if (0 < o)
                  for (var h = 0; h < o; h += 1) {
                    var l = this.optionalObjectives[h].reducedCosts;
                    l[i] = l[r];
                  }
                var u = this.varIndexByCol[r];
                (this.varIndexByCol[i] = u), (this.colByVarIndex[u] = i);
              }
              (this.varIndexByCol[r] = -1),
                (this.colByVarIndex[e] = -1),
                (this.availableIndexes[this.availableIndexes.length] = e),
                (t.index = -1),
                (this.width -= 1);
            });
        },
        { "./Tableau.js": 9 },
      ],
      15: [
        function (t, e, i) {
          t("./simplex.js"),
            t("./cuttingStrategies.js"),
            t("./dynamicModification.js"),
            t("./log.js"),
            t("./backup.js"),
            t("./branchingStrategies.js"),
            t("./integerProperties.js"),
            (e.exports = t("./Tableau.js"));
        },
        {
          "./Tableau.js": 9,
          "./backup.js": 10,
          "./branchingStrategies.js": 12,
          "./cuttingStrategies.js": 13,
          "./dynamicModification.js": 14,
          "./integerProperties.js": 16,
          "./log.js": 17,
          "./simplex.js": 18,
        },
      ],
      16: [
        function (t, e, i) {
          var r = t("./Tableau.js");
          (r.prototype.countIntegerValues = function () {
            for (var t = 0, e = 1; e < this.height; e += 1)
              if (this.variablesPerIndex[this.varIndexByRow[e]].isInteger) {
                var i = this.matrix[e][this.rhsColumn];
                (i -= Math.floor(i)) < this.precision &&
                  -i < this.precision &&
                  (t += 1);
              }
            return t;
          }),
            (r.prototype.isIntegral = function () {
              for (
                var t = this.model.integerVariables, e = t.length, i = 0;
                i < e;
                i++
              ) {
                var r = this.rowByVarIndex[t[i].index];
                if (-1 !== r) {
                  var s = this.matrix[r][this.rhsColumn];
                  if (Math.abs(s - Math.round(s)) > this.precision) return !1;
                }
              }
              return !0;
            }),
            (r.prototype.computeFractionalVolume = function (t) {
              for (var e = -1, i = 1; i < this.height; i += 1)
                if (this.variablesPerIndex[this.varIndexByRow[i]].isInteger) {
                  var r = this.matrix[i][this.rhsColumn];
                  if (
                    ((r = Math.abs(r)),
                    Math.min(r - Math.floor(r), Math.floor(r + 1)) <
                      this.precision)
                  ) {
                    if (!t) return 0;
                  } else -1 === e ? (e = r) : (e *= r);
                }
              return -1 === e ? 0 : e;
            });
        },
        { "./Tableau.js": 9 },
      ],
      17: [
        function (t, e, i) {
          t("./Tableau.js").prototype.log = function (t, e) {
            console.log("****", t, "****"),
              console.log("Nb Variables", this.width - 1),
              console.log("Nb Constraints", this.height - 1),
              console.log("Basic Indexes", this.varIndexByRow),
              console.log("Non Basic Indexes", this.varIndexByCol),
              console.log("Rows", this.rowByVarIndex),
              console.log("Cols", this.colByVarIndex);
            var i,
              r,
              s,
              a,
              n,
              o,
              h,
              l,
              u,
              d,
              c,
              v = "",
              p = [" "];
            for (r = 1; r < this.width; r += 1)
              (n = this.varIndexByCol[r]),
                (h = (o =
                  void 0 === (a = this.variablesPerIndex[n]) ? "c" + n : a.id)
                  .length),
                Math.abs(h - 5),
                (l = " "),
                (u = "\t"),
                5 < h ? (l += " ") : (u += "\t"),
                (p[r] = l),
                (v += u + o);
            console.log(v);
            var f = this.matrix[this.costRowIndex],
              x = "\t";
            for (i = 1; i < this.width; i += 1)
              (x += "\t"), (x += p[i]), (x += f[i].toFixed(5));
            for (
              x += "\t" + p[0] + f[0].toFixed(5), console.log(x + "\tZ"), s = 1;
              s < this.height;
              s += 1
            ) {
              for (d = this.matrix[s], c = "\t", r = 1; r < this.width; r += 1)
                c += "\t" + p[r] + d[r].toFixed(5);
              (c += "\t" + p[0] + d[0].toFixed(5)),
                (n = this.varIndexByRow[s]),
                (o =
                  void 0 === (a = this.variablesPerIndex[n]) ? "c" + n : a.id),
                console.log(c + "\t" + o);
            }
            console.log("");
            var b = this.optionalObjectives.length;
            if (0 < b) {
              console.log("    Optional objectives:");
              for (var m = 0; m < b; m += 1) {
                var y = this.optionalObjectives[m].reducedCosts,
                  I = "";
                for (i = 1; i < this.width; i += 1)
                  (I += y[i] < 0 ? "" : " "),
                    (I += p[i]),
                    (I += y[i].toFixed(5));
                (I += (y[0] < 0 ? "" : " ") + p[0] + y[0].toFixed(5)),
                  console.log(I + " z" + m);
              }
            }
            return (
              console.log("Feasible?", this.feasible),
              console.log("evaluation", this.evaluation),
              this
            );
          };
        },
        { "./Tableau.js": 9 },
      ],
      18: [
        function (t, e, i) {
          var r = t("./Tableau.js");
          (r.prototype.simplex = function () {
            return (
              (this.bounded = !0),
              this.phase1(),
              !0 === this.feasible && this.phase2(),
              this
            );
          }),
            (r.prototype.phase1 = function () {
              for (
                var t = this.model.checkForCycles,
                  e = [],
                  i = this.matrix,
                  r = this.rhsColumn,
                  s = this.width - 1,
                  a = this.height - 1,
                  n = 0;
                ;

              ) {
                for (var o = 0, h = -this.precision, l = 1; l <= a; l++) {
                  !0 === this.unrestrictedVars[this.varIndexByRow[l]];
                  var u = i[l][r];
                  u < h && ((h = u), (o = l));
                }
                if (0 === o) return (this.feasible = !0), n;
                for (
                  var d = 0, c = -1 / 0, v = i[0], p = i[o], f = 1;
                  f <= s;
                  f++
                ) {
                  var x = p[f];
                  if (
                    !0 === this.unrestrictedVars[this.varIndexByCol[f]] ||
                    x < -this.precision
                  ) {
                    var b = -v[f] / x;
                    c < b && ((c = b), (d = f));
                  }
                }
                if (0 === d) return (this.feasible = !1), n;
                if (t) {
                  e.push([this.varIndexByRow[o], this.varIndexByCol[d]]);
                  var m = this.checkForCycles(e);
                  if (0 < m.length)
                    return (
                      this.model.messages.push("Cycle in phase 1"),
                      this.model.messages.push("Start :" + m[0]),
                      this.model.messages.push("Length :" + m[1]),
                      (this.feasible = !1),
                      n
                    );
                }
                this.pivot(o, d), (n += 1);
              }
            }),
            (r.prototype.phase2 = function () {
              for (
                var t,
                  e,
                  i = this.model.checkForCycles,
                  r = [],
                  s = this.matrix,
                  a = this.rhsColumn,
                  n = this.width - 1,
                  o = this.height - 1,
                  h = this.precision,
                  l = this.optionalObjectives.length,
                  u = null,
                  d = 0;
                ;

              ) {
                var c = s[this.costRowIndex];
                0 < l && (u = []);
                for (var v = 0, p = h, f = !1, x = 1; x <= n; x++)
                  (t = c[x]),
                    (e = !0 === this.unrestrictedVars[this.varIndexByCol[x]]),
                    0 < l && -h < t && t < h
                      ? u.push(x)
                      : e && t < 0
                      ? p < -t && ((p = -t), (v = x), (f = !0))
                      : p < t && ((p = t), (v = x), (f = !1));
                if (0 < l)
                  for (var b = 0; 0 === v && 0 < u.length && b < l; ) {
                    var m = [],
                      y = this.optionalObjectives[b].reducedCosts;
                    p = h;
                    for (var I = 0; I < u.length; I++)
                      (t = y[(x = u[I])]),
                        (e =
                          !0 === this.unrestrictedVars[this.varIndexByCol[x]]),
                        -h < t && t < h
                          ? m.push(x)
                          : e && t < 0
                          ? p < -t && ((p = -t), (v = x), (f = !0))
                          : p < t && ((p = t), (v = x), (f = !1));
                    (u = m), (b += 1);
                  }
                if (0 === v)
                  return this.setEvaluation(), (this.simplexIters += 1), d;
                for (
                  var g = 0, w = 1 / 0, C = (this.varIndexByRow, 1);
                  C <= o;
                  C++
                ) {
                  var B = s[C],
                    V = B[a],
                    j = B[v];
                  if (!(-h < j && j < h)) {
                    if (0 < j && V < h && -h < V) {
                      (w = 0), (g = C);
                      break;
                    }
                    var O = f ? -V / j : V / j;
                    h < O && O < w && ((w = O), (g = C));
                  }
                }
                if (w === 1 / 0)
                  return (
                    (this.evaluation = -1 / 0),
                    (this.bounded = !1),
                    (this.unboundedVarIndex = this.varIndexByCol[v]),
                    d
                  );
                if (i) {
                  r.push([this.varIndexByRow[g], this.varIndexByCol[v]]);
                  var R = this.checkForCycles(r);
                  if (0 < R.length)
                    return (
                      this.model.messages.push("Cycle in phase 2"),
                      this.model.messages.push("Start :" + R[0]),
                      this.model.messages.push("Length :" + R[1]),
                      (this.feasible = !1),
                      d
                    );
                }
                this.pivot(g, v, !0), (d += 1);
              }
            });
          var y = [];
          (r.prototype.pivot = function (t, e) {
            var i = this.matrix,
              r = i[t][e],
              s = this.height - 1,
              a = this.width - 1,
              n = this.varIndexByRow[t],
              o = this.varIndexByCol[e];
            (this.varIndexByRow[t] = o),
              (this.varIndexByCol[e] = n),
              (this.rowByVarIndex[o] = t),
              (this.rowByVarIndex[n] = -1),
              (this.colByVarIndex[o] = -1),
              (this.colByVarIndex[n] = e);
            for (var h, l, u, d = i[t], c = 0, v = 0; v <= a; v++)
              -1e-16 <= d[v] && d[v] <= 1e-16
                ? (d[v] = 0)
                : ((d[v] /= r), (y[c] = v), (c += 1));
            d[e] = 1 / r;
            this.precision;
            for (var p = 0; p <= s; p++)
              if (p !== t && !(-1e-16 <= i[p][e] && i[p][e] <= 1e-16)) {
                var f = i[p];
                if (-1e-16 <= (h = f[e]) && h <= 1e-16) 0 !== h && (f[e] = 0);
                else {
                  for (l = 0; l < c; l++)
                    -1e-16 <= (u = d[(v = y[l])]) && u <= 1e-16
                      ? 0 !== u && (d[v] = 0)
                      : (f[v] = f[v] - h * u);
                  f[e] = -h / r;
                }
              }
            var x = this.optionalObjectives.length;
            if (0 < x)
              for (var b = 0; b < x; b += 1) {
                var m = this.optionalObjectives[b].reducedCosts;
                if (0 !== (h = m[e])) {
                  for (l = 0; l < c; l++)
                    0 !== (u = d[(v = y[l])]) && (m[v] = m[v] - h * u);
                  m[e] = -h / r;
                }
              }
          }),
            (r.prototype.checkForCycles = function (t) {
              for (var e = 0; e < t.length - 1; e++)
                for (var i = e + 1; i < t.length; i++) {
                  var r = t[e],
                    s = t[i];
                  if (r[0] === s[0] && r[1] === s[1]) {
                    if (i - e > t.length - i) break;
                    for (var a = !0, n = 1; n < i - e; n++) {
                      var o = t[e + n],
                        h = t[i + n];
                      if (o[0] !== h[0] || o[1] !== h[1]) {
                        a = !1;
                        break;
                      }
                    }
                    if (a) return [e, i - e];
                  }
                }
              return [];
            });
        },
        { "./Tableau.js": 9 },
      ],
      19: [
        function (t, e, i) {
          i.CleanObjectiveAttributes = function (t) {
            var e, i, r;
            if ("string" == typeof t.optimize) {
              if (t.constraints[t.optimize]) {
                for (i in ((e = Math.random()), t.variables))
                  t.variables[i][t.optimize] &&
                    (t.variables[i][e] = t.variables[i][t.optimize]);
                return (
                  (t.constraints[e] = t.constraints[t.optimize]),
                  delete t.constraints[t.optimize],
                  t
                );
              }
              return t;
            }
            for (r in t.optimize)
              if (t.constraints[r])
                if ("equal" === t.constraints[r]) delete t.optimize[r];
                else {
                  for (i in ((e = Math.random()), t.variables))
                    t.variables[i][r] &&
                      (t.variables[i][e] = t.variables[i][r]);
                  (t.constraints[e] = t.constraints[r]),
                    delete t.constraints[r];
                }
            return t;
          };
        },
        {},
      ],
      20: [
        function (t, e, i) {
          function s(t, e, i, r) {
            (this.id = t),
              (this.cost = e),
              (this.index = i),
              (this.value = 0),
              (this.priority = r);
          }

          function r(t, e, i, r) {
            s.call(this, t, e, i, r);
          }

          function a(t, e) {
            s.call(this, t, 0, e, 0);
          }

          function n(t, e) {
            (this.variable = t), (this.coefficient = e);
          }

          function o(t, e, i) {
            return 0 === i || "required" === i
              ? null
              : ((e = e || 1),
                (i = i || 1),
                !1 === t.isMinimization && (e = -e),
                t.addVariable(e, "r" + t.relaxationIndex++, !1, !1, i));
          }

          function h(t, e, i, r) {
            (this.slack = new a("s" + i, i)),
              (this.index = i),
              (this.model = r),
              (this.rhs = t),
              (this.isUpperBound = e),
              (this.terms = []),
              (this.termsByVarIndex = {}),
              (this.relaxation = null);
          }

          function l(t, e) {
            (this.upperBound = t),
              (this.lowerBound = e),
              (this.model = t.model),
              (this.rhs = t.rhs),
              (this.relaxation = null);
          }

          (a.prototype.isSlack = r.prototype.isInteger = !0),
            (h.prototype.addTerm = function (t, e) {
              var i = e.index,
                r = this.termsByVarIndex[i];
              if (void 0 === r)
                (r = new n(e, t)),
                  (this.termsByVarIndex[i] = r),
                  this.terms.push(r),
                  !0 === this.isUpperBound && (t = -t),
                  this.model.updateConstraintCoefficient(this, e, t);
              else {
                var s = r.coefficient + t;
                this.setVariableCoefficient(s, e);
              }
              return this;
            }),
            (h.prototype.removeTerm = function (t) {
              return this;
            }),
            (h.prototype.setRightHandSide = function (t) {
              if (t !== this.rhs) {
                var e = t - this.rhs;
                !0 === this.isUpperBound && (e = -e),
                  (this.rhs = t),
                  this.model.updateRightHandSide(this, e);
              }
              return this;
            }),
            (h.prototype.setVariableCoefficient = function (t, e) {
              var i = e.index;
              if (-1 !== i) {
                var r = this.termsByVarIndex[i];
                if (void 0 === r) this.addTerm(t, e);
                else if (t !== r.coefficient) {
                  var s = t - r.coefficient;
                  !0 === this.isUpperBound && (s = -s),
                    (r.coefficient = t),
                    this.model.updateConstraintCoefficient(this, e, s);
                }
                return this;
              }
              console.warn(
                "[Constraint.setVariableCoefficient] Trying to change coefficient of inexistant variable."
              );
            }),
            (h.prototype.relax = function (t, e) {
              (this.relaxation = o(this.model, t, e)),
                this._relax(this.relaxation);
            }),
            (h.prototype._relax = function (t) {
              null !== t &&
                (this.isUpperBound
                  ? this.setVariableCoefficient(-1, t)
                  : this.setVariableCoefficient(1, t));
            }),
            (l.prototype.isEquality = !0),
            (l.prototype.addTerm = function (t, e) {
              return (
                this.upperBound.addTerm(t, e),
                this.lowerBound.addTerm(t, e),
                this
              );
            }),
            (l.prototype.removeTerm = function (t) {
              return (
                this.upperBound.removeTerm(t),
                this.lowerBound.removeTerm(t),
                this
              );
            }),
            (l.prototype.setRightHandSide = function (t) {
              this.upperBound.setRightHandSide(t),
                this.lowerBound.setRightHandSide(t),
                (this.rhs = t);
            }),
            (l.prototype.relax = function (t, e) {
              (this.relaxation = o(this.model, t, e)),
                (this.upperBound.relaxation = this.relaxation),
                this.upperBound._relax(this.relaxation),
                (this.lowerBound.relaxation = this.relaxation),
                this.lowerBound._relax(this.relaxation);
            }),
            (e.exports = {
              Constraint: h,
              Variable: s,
              IntegerVariable: r,
              SlackVariable: a,
              Equality: l,
              Term: n,
            });
        },
        {},
      ],
      21: [
        function (h, t, e) {
          function i() {
            "use strict";
            (this.Model = l),
              (this.branchAndCut = s),
              (this.Constraint = n),
              (this.Variable = o),
              (this.Numeral = d),
              (this.Term = c),
              (this.Tableau = r),
              (this.lastSolvedModel = null),
              (this.External = v),
              (this.Solve = function (t, e, i, r) {
                if (r) for (var s in u) t = u[s](t);
                if (!t)
                  throw new Error("Solver requires a model to operate on");
                if (
                  "object" == typeof t.optimize &&
                  Object.keys(1 < t.optimize)
                )
                  return h("./Polyopt")(this, t);
                if (t.external) {
                  var a = Object.keys(v);
                  if (((a = JSON.stringify(a)), !t.external.solver))
                    throw new Error(
                      "The model you provided has an 'external' object that doesn't have a solver attribute. Use one of the following:" +
                        a
                    );
                  if (!v[t.external.solver])
                    throw new Error(
                      "No support (yet) for " +
                        t.external.solver +
                        ". Please use one of these instead:" +
                        a
                    );
                  return v[t.external.solver].solve(t);
                }
                t instanceof l == !1 && (t = new l(e).loadJson(t));
                var n = t.solve();
                if (
                  ((this.lastSolvedModel = t),
                  (n.solutionSet = n.generateSolutionSet()),
                  i)
                )
                  return n;
                var o = {};
                return (
                  (o.feasible = n.feasible),
                  (o.result = n.evaluation),
                  (o.bounded = n.bounded),
                  n._tableau.__isIntegral && (o.isIntegral = !0),
                  Object.keys(n.solutionSet).forEach(function (t) {
                    0 !== n.solutionSet[t] && (o[t] = n.solutionSet[t]);
                  }),
                  o
                );
              }),
              (this.ReformatLP = h("./External/lpsolve/Reformat.js")),
              (this.MultiObjective = function (t) {
                return h("./Polyopt")(this, t);
              });
          }

          var r = h("./Tableau/index.js"),
            l = h("./Model"),
            s = h("./Tableau/branchAndCut"),
            a = h("./expressions.js"),
            u = h("./Validation"),
            n = a.Constraint,
            o = a.Variable,
            d = a.Numeral,
            c = a.Term,
            v = h("./External/main.js");
          "function" == typeof define
            ? define([], function () {
                return new i();
              })
            : "object" == typeof window
            ? (window.solver = new i())
            : "object" == typeof self && (self.solver = new i()),
            (t.exports = new i());
        },
        {
          "./External/lpsolve/Reformat.js": 2,
          "./External/main.js": 4,
          "./Model": 5,
          "./Polyopt": 6,
          "./Tableau/branchAndCut": 11,
          "./Tableau/index.js": 15,
          "./Validation": 19,
          "./expressions.js": 20,
        },
      ],
    },
    {},
    [21]
  );
//# sourceMappingURL=solver.js.map
