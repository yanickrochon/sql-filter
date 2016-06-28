
Expression
 = FieldPath / FieldList / FieldArray / FieldName

Space
 = ' ' / '\t'

FieldSeparator
 = Space* '.' Space*

FieldName
 = Space* prefix:[a-z] suffix:[a-z0-9_-]* Space* { return prefix + suffix.join(''); }

FieldArray
 = f:FieldName '[]' FieldSeparator p:( l:FieldList { return [l]; } / a:FieldArray { return [a]; } / p:FieldPath { return p.path; } / f:FieldName { return [f]; } ) { return { array: f, path: p }; }

FieldPath
 = f:( FieldList / FieldArray / FieldName) n:( FieldSeparator ( FieldList / FieldArray / FieldName)) + { return { path: [f].concat(n.map(function (i) { return i[1]; })) }; }

FieldList
 = '{{' Space* list:( l:Expression r:( Space* ',' Space* e:Expression { return e; } )* { return [l].concat(r); }  ) Space* '}}' { return { glue: 'AND', list: list }; }
 / '{' Space* list:( l:Expression r:( Space* ',' Space* e:Expression { return e; } )* { return [l].concat(r); }  ) Space* '}' { return { glue: 'OR', list: list }; }
