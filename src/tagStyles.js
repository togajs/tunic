// @tag {kind} name - description
export const atCurlyDash = {
	tag: /^[\t ]*?@(\w+)[\t \-]*/,
	kind: /(?:\{(.*[^\\])?\})?[\t \-]*/,
	name: /(\[[^\]]*\]\*?|\S*)?[\t ]*/,
	delimiter: /(-?)[\t ]*/,
	description: /(.*(?:\n+[\t ]+.*)*)/
};

// \tag {kind} name - description
export const backSlashCurlyDash = {
	tag: /^[\t ]*?\\(\w+)[\t \-]*/,
	kind: /(?:\{(.*[^\\])?\})?[\t \-]*/,
	name: /(\[[^\]]*\]\*?|\S*)?[\t ]*/,
	delimiter: /(-?)[\t ]*/,
	description: /(.*(?:\n+[\t ]+.*)*)/
};
