{
  /*
  @version 3
  */
}

Expression
 = Space* e:( FieldList / FieldArray / FieldPath ) Space* { return e; }

Space
 = ' ' / '\t'

FieldSeparator
 = Space* '.' Space*

FieldName
 = Space* prefix:[a-z] suffix:$[a-z0-9_-]* Space* { return prefix + suffix; }

FieldArray
 = f:FieldName '[]' FieldSeparator p:FieldPath { p.array = f; return p; }

FieldPath
 = f:( FieldList / FieldArray / FieldName) n:( FieldSeparator ( FieldList / FieldArray / FieldName)) * Space* o:FieldOptions ? { var path = { path: [f].concat(n.map(function (i) { return i[1]; })) }; if (o) path.options = o; return path; }

FieldOptions
 = '(' Space* o:$[^), ]+ Space* a:( Space* ',' Space* v:$[0-9]+ { return parseInt(v, 10); } )* Space* ')' { var options = { operator: o }; if (a.length) options.arguments = a; return options; }

FieldList
 = '{{' Space* list:( l:Expression r:( Space* ',' Space* e:Expression { return e; } )* { return [l].concat(r); }  ) Space* '}}' { return { glue: 'AND', list: list }; }
 / '{' Space* list:( l:Expression r:( Space* ',' Space* e:Expression { return e; } )* { return [l].concat(r); }  ) Space* '}' { return { glue: 'OR', list: list }; }
