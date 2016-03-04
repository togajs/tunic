// <!--
//  ! Foo
//  !-->
export const angleBangDashDash = {
	open: /^[\t ]*?<!--/,
	close: /-->/,
	indent: /[\t !\-]*/
};

// !>
// !! Foo
// !!
export const bangBang = {
	open: /^(?=[\t ]*?![<!>])/,
	close: /^(?![\t ]*?![<!>])/,
	indent: /[\t ]*![<!>][\t ]*/
};

// {-|
//  - Foo
//  -}
export const curlyDashPipe = {
	open: /^[\t ]*?\{-\|/,
	close: /-\}/,
	indent: /[\t \-]*/
};

// {##
//  # Foo
//  #}
export const curlyHashHash = {
	open: /^[\t ]*?\{##/,
	close: /#\}/,
	indent: /[\t #]*/
};

// {%%
//  % Foo
//  %}
export const curlyPercPerc = {
	open: /^[\t ]*?\{%%/,
	close: /%\}/,
	indent: /[\t %]*/
};

// --!
// --! Foo
// --!
export const dashDashBang = {
	open: /^(?=[\t ]*?--!)/,
	close: /^(?![\t ]*?--!)/,
	indent: /[\t ]*--![\t ]*/
};

// =begin
// Foo
// =end
export const eqBegin = {
	open: /^=begin/,
	close: /^=end/,
	indent: /[\t ]*/
};

// =pod
// Foo
// =cut
export const eqPod = {
	open: /^=pod/,
	close: /^=cut/,
	indent: /[\t ]*/
};

// ##
// # Foo
export const hashHash = {
	open: /^[\t ]*?##/,
	close: /^(?![\t ]*?#)/,
	indent: /[\t ]*#[\t ]*/
};

// ###
// # Foo
// ###
export const hashHashHash = {
	open: /^[\t ]*?###/,
	close: /^[\t ]*?###/,
	indent: /[\t ]*#[\t ]*/
};

// (**
//  * Foo
//  *)
export const parenStarStar = {
	open: /^[\t ]*?\(\*\*/,
	close: /\*\)/,
	indent: /[\t \*]*/
};

// %%
// % Foo
export const percPerc = {
	open: /^[\t ]*?%%/,
	close: /^(?![\t ]*?%)/,
	indent: /[\t ]*%[\t ]*/
};

// %%%
// % Foo
// %%%
export const percPercPerc = {
	open: /^[\t ]*?%%%/,
	close: /^[\t ]*?%%%/,
	indent: /[\t ]*%[\t ]*/
};

// ""
// " Foo
export const quoteQuote = {
	open: /^[\t ]*?""/,
	close: /^(?![\t ]*?")/,
	indent: /[\t ]*"[\t ]*/
};

// """
// " Foo
// """
export const quoteQuoteQuote = {
	open: /^[\t ]*?"""/,
	close: /^[\t ]*?"""/,
	indent: /[\t ]*"[\t ]*/
};

// ''
// ' Foo
export const singSing = {
	open: /^[\t ]*?''/,
	close: /^(?![\t ]*?')/,
	indent: /[\t ]*'[\t ]*/
};

// '''
// ' Foo
// '''
export const singSingSing = {
	open: /^[\t ]*?'''/,
	close: /^[\t ]*?'''/,
	indent: /[\t ]*'[\t ]*/
};

// /// Foo
// /// Bar
// /// Baz
export const slashSlashSlash = {
	open: /^(?=[\t ]*?\/\/\/)/,
	close: /^(?![\t ]*?\/\/)/,
	indent: /[\t ]*\/\/\/?[\t ]*/
};

// /**
//  * Foo
//  */
export const slashStarStar = {
	open: /^[\t ]*?\/\*\*/,
	close: /\*\//,
	indent: /[\t \*]*/
};
