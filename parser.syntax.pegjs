{
  /*
  @version 3
  */
}

Expression
 = FieldList / FieldArray / FieldPath

Space
 = ' ' / '\t'

FieldSeparator
 = Space* '.' Space*

FieldName
 = Space* prefix:[a-z] suffix:[a-z0-9_-]* Space* { return prefix + suffix.join(''); }

FieldArray
 = f:FieldName '[]' FieldSeparator p:FieldPath { p.array = f; return p; }

FieldPath
 = f:( FieldList / FieldArray / FieldName) n:( FieldSeparator ( FieldList / FieldArray / FieldName)) * o:FieldOptions ? { var path = { path: [f].concat(n.map(function (i) { return i[1]; })) }; if (o) path.options = o; return path; }
 
FieldOptions
 = '(' o:[^,)]+ a:( ',' v:[0-9]+ { return parseInt(v.join(''), 10); } ) ? ')' { var options = { operator: o.join('') }; if (a) options.argument = a; return options; }

FieldList
 = '{{' Space* list:( l:Expression r:( Space* ',' Space* e:Expression { return e; } )* { return [l].concat(r); }  ) Space* '}}' { return { glue: 'AND', list: list }; }
 / '{' Space* list:( l:Expression r:( Space* ',' Space* e:Expression { return e; } )* { return [l].concat(r); }  ) Space* '}' { return { glue: 'OR', list: list }; }
