interface WithxmeetsSearchEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  members: string[];
}

interface SearchConditions {
  keyword: string;
  startDate: string;
  endDate: string;
  members: string[];
}

function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(
      `With×MEETS検索画面の要素を取得できませんでした: ${selector}`,
    );
  }
  return element;
}

const form = getRequiredElement<HTMLFormElement>("#withxmeets-search-form");
const keywordInput = getRequiredElement<HTMLInputElement>("#search-keyword");
const startDateInput =
  getRequiredElement<HTMLInputElement>("#search-start-date");
const endDateInput = getRequiredElement<HTMLInputElement>("#search-end-date");
const resetButton = getRequiredElement<HTMLButtonElement>("#search-reset");
const statusElement = getRequiredElement<HTMLElement>("#search-status");
const results = getRequiredElement<HTMLUListElement>("#search-results");

const memberInputs = Array.from(
  form.querySelectorAll<HTMLInputElement>('input[name="member"]'),
);
const validMembers = new Set(memberInputs.map((input) => input.value));
const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Tokyo",
});

let searchEntries: WithxmeetsSearchEntry[] = [];

function normalizeKeyword(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("ja-JP");
}

function getConditions(): SearchConditions {
  return {
    keyword: keywordInput.value.trim(),
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    members: memberInputs
      .filter((input) => input.checked)
      .map((input) => input.value),
  };
}

function hasConditions(conditions: SearchConditions): boolean {
  return Boolean(
    conditions.keyword ||
    conditions.startDate ||
    conditions.endDate ||
    conditions.members.length > 0,
  );
}

function updateUrl(conditions: SearchConditions): void {
  const url = new URL(window.location.href);
  url.search = "";

  if (conditions.keyword) url.searchParams.set("keyword", conditions.keyword);
  if (conditions.startDate) url.searchParams.set("start", conditions.startDate);
  if (conditions.endDate) url.searchParams.set("end", conditions.endDate);
  conditions.members.forEach((member) =>
    url.searchParams.append("member", member),
  );

  window.history.replaceState({}, "", url);
}

function createResult(entry: WithxmeetsSearchEntry): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "withxmeets-search-result-item";

  const link = document.createElement("a");
  link.className = "withxmeets-search-result-card";
  link.href = `/withxmeets/${encodeURIComponent(entry.id)}`;

  const title = document.createElement("h3");
  title.className = "withxmeets-search-result-card-title";
  title.textContent = entry.title;

  const meta = document.createElement("div");
  meta.className = "withxmeets-search-result-meta";

  const date = document.createElement("time");
  date.dateTime = entry.date;
  date.textContent = dateFormatter.format(
    new Date(`${entry.date}T00:00:00+09:00`),
  );

  const members = document.createElement("span");
  members.textContent = entry.members.join("、");

  meta.append(date, members);
  link.append(title, meta);

  if (entry.description) {
    const description = document.createElement("p");
    description.className = "withxmeets-search-result-description";
    description.textContent = entry.description;
    link.append(description);
  }

  item.append(link);
  return item;
}

function renderSearchResults(updateHistory = true): void {
  const conditions = getConditions();
  results.replaceChildren();

  if (updateHistory) updateUrl(conditions);

  if (!hasConditions(conditions)) {
    statusElement.className = "withxmeets-search-status";
    statusElement.textContent =
      "With×MEETSの検索条件を指定して検索してください";
    return;
  }

  if (
    conditions.startDate &&
    conditions.endDate &&
    conditions.startDate > conditions.endDate
  ) {
    statusElement.className =
      "withxmeets-search-status withxmeets-search-error";
    statusElement.textContent = "開始日は終了日以前の日付を指定してください。";
    return;
  }

  const keyword = normalizeKeyword(conditions.keyword);
  const filtered = searchEntries.filter((entry) => {
    const matchesKeyword =
      !keyword || normalizeKeyword(entry.title).includes(keyword);
    const matchesStartDate =
      !conditions.startDate || entry.date >= conditions.startDate;
    const matchesEndDate =
      !conditions.endDate || entry.date <= conditions.endDate;
    const matchesMembers = conditions.members.every((member) =>
      entry.members.includes(member),
    );

    return (
      matchesKeyword && matchesStartDate && matchesEndDate && matchesMembers
    );
  });

  statusElement.className = "withxmeets-search-status";
  statusElement.textContent =
    filtered.length > 0
      ? `${filtered.length}件見つかりました。`
      : "条件に一致するWith×MEETSはありません。";

  results.append(...filtered.map(createResult));
}

function applyUrlParameters(): void {
  const params = new URLSearchParams(window.location.search);
  keywordInput.value = params.get("keyword") ?? "";
  startDateInput.value = params.get("start") ?? "";
  endDateInput.value = params.get("end") ?? "";

  const selectedMembers = new Set(
    params.getAll("member").filter((member) => validMembers.has(member)),
  );
  memberInputs.forEach((input) => {
    input.checked = selectedMembers.has(input.value);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderSearchResults();
});

resetButton.addEventListener("click", () => {
  form.reset();
  renderSearchResults();
  keywordInput.focus();
});

applyUrlParameters();

try {
  const response = await fetch("/withxmeets/search-index.json");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  searchEntries = (await response.json()) as WithxmeetsSearchEntry[];
  renderSearchResults(false);
} catch (error) {
  console.error("With×MEETS検索データの取得に失敗しました。", error);
  statusElement.className = "withxmeets-search-status withxmeets-search-error";
  statusElement.textContent = "検索データを読み込めませんでした。";
}

export {};
