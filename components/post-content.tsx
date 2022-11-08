import React from "react";

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export default React.memo(function Content({ value }: { value: string }) {
  const regex = /(?:^|[^@\w])@(\w{1,15}#[\d]+)\b/g;
  const html = escapeHtml(value).replace(regex, (...args) => {
    return `<a href="${encodeURIComponent(
      args[1]
    )}" class="text-sky-500 no-underline hover:underline">@${args[1]}</a>`;
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
});
