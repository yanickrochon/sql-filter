
Expression
 = FieldPath / FieldList / FieldArray / FieldName

Space
 = ' ' / '\t'

FieldName
 = prefix:[a-z] suffix:[a-z0-9_-]* { return prefix + suffix.join(''); }

FieldArray
 = f:FieldName '[].' p:( l:FieldList { return [l]; } / a:FieldArray { return [a]; } / p:FieldPath { return p.path; } / f:FieldName { return [f]; } ) { return { array: f, path: p }; }

FieldPath
 = f:( FieldList / FieldArray / FieldName) n:('.' ( FieldList / FieldArray / FieldName)) + { return { path: [f].concat(n.map(function (i) { return i[1]; })) }; }

FieldList
 = '{{' list:( l:Expression r:( Space* ','? Space* e:Expression { return e; } )* { return [l].concat(r); }  ) '}}' { return { glue: 'AND', list: list }; }
 / '{' list:( l:Expression r:( Space* ','? Space* e:Expression { return e; } )* { return [l].concat(r); }  ) '}' { return { glue: 'OR', list: list }; }
