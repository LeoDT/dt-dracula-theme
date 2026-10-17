import { Gtk } from "ags/gtk4";
import fetch from "ags/fetch";
import { createComputed, createState, For } from "gnim";
import Gio from "gi://Gio?version=2.0";
import GLib from "gi://GLib?version=2.0";

const TOKEN_PATH = GLib.build_filenamev([GLib.get_home_dir(), ".secrets", "ds-usage-token"]);
const TOKEN_DISPLAY = "~/.secrets/ds-usage-token";
const BALANCE_URL = "https://api.deepseek.com/user/balance";
const PANEL_WIDTH = 240;
const LOADING_DELAY_MS = 500;
const WALLET_GLYPH = "\u{f555}"; // nf-fa-wallet

type BalanceInfo = {
  currency: string;
  total_balance: string;
};

type BalanceResponse = {
  is_available: boolean;
  balance_infos: BalanceInfo[];
};

type ViewState = {
  data: BalanceResponse | null;
  error: string | null;
  loading: boolean;
};

function readToken(): string {
  let contents: Uint8Array;
  try {
    [, contents] = Gio.File.new_for_path(TOKEN_PATH).load_contents(null);
  } catch {
    throw new Error(`无法读取 ${TOKEN_DISPLAY}`);
  }

  const token = new TextDecoder().decode(contents).trim();
  if (!token) throw new Error(`${TOKEN_DISPLAY} 为空`);
  return token;
}

function parseBalance(raw: unknown): BalanceResponse {
  if (!raw || typeof raw !== "object") throw new Error("响应格式异常");

  const value = raw as Record<string, unknown>;
  if (typeof value.is_available !== "boolean" || !Array.isArray(value.balance_infos)) {
    throw new Error("响应格式异常");
  }

  const balance_infos: BalanceInfo[] = [];
  for (const entry of value.balance_infos) {
    if (!entry || typeof entry !== "object") throw new Error("响应格式异常");

    const info = entry as Record<string, unknown>;
    if (typeof info.currency !== "string" || typeof info.total_balance !== "string") {
      throw new Error("响应格式异常");
    }
    balance_infos.push({
      currency: info.currency,
      total_balance: info.total_balance,
    });
  }

  return { is_available: value.is_available, balance_infos };
}

function errorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : "查询失败";
}

export default function DeepSeekUsage() {
  const [state, setState] = createState<ViewState>({
    data: null,
    error: null,
    loading: false,
  });
  const [showLoading, setShowLoading] = createState(false);
  let requestId = 0;
  let loadingTimer: number | null = null;

  function stopLoadingTimer() {
    if (loadingTimer !== null) {
      GLib.source_remove(loadingTimer);
      loadingTimer = null;
    }
    setShowLoading(false);
  }

  function startLoadingTimer() {
    stopLoadingTimer();
    loadingTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, LOADING_DELAY_MS, () => {
      loadingTimer = null;
      setShowLoading(true);
      return GLib.SOURCE_REMOVE;
    });
  }

  async function load() {
    const id = ++requestId;
    setState((s) => ({ ...s, loading: true, error: null }));
    startLoadingTimer();

    try {
      const token = readToken();
      const response = await fetch(BALANCE_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (id !== requestId) return;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = parseBalance(await response.json());
      if (id !== requestId) return;
      stopLoadingTimer();
      setState({ data, error: null, loading: false });
    } catch (error) {
      if (id !== requestId) return;
      stopLoadingTimer();
      setState((s) => ({ ...s, loading: false, error: errorMessage(error) }));
    }
  }

  const balances = createComputed(() => state().data?.balance_infos ?? []);
  const hasData = createComputed(() => state().data !== null);
  const status = createComputed(() => (state().data?.is_available ? "可用" : "不可用"));
  const statusClass = createComputed(() =>
    state().data?.is_available ? "ds-status ok" : "ds-status err",
  );
  const message = createComputed(() => {
    const s = state();
    if (s.loading) {
      if (!s.data) return "查询中…";
      return showLoading() ? "刷新中…" : "";
    }
    if (s.error) return s.error;
    if (s.data && s.data.balance_infos.length === 0) return "无余额信息";
    return "";
  });
  const messageClass = createComputed(() =>
    state().error ? "ds-message err" : "ds-message",
  );
  const messageVisible = createComputed(() => message() !== "");

  return (
    <menubutton class="status-button" valign={Gtk.Align.CENTER} alwaysShowArrow={false}>
      <label class="ds-glyph" label={WALLET_GLYPH} />
      <popover
        onNotifyVisible={(self: Gtk.Popover) => {
          if (self.visible) void load();
        }}
      >
        <box
          class="panel"
          orientation={Gtk.Orientation.VERTICAL}
          spacing={10}
          widthRequest={PANEL_WIDTH}
        >
          <box spacing={8}>
            <label class="panel-title" label="DeepSeek 余额" xalign={0} hexpand />
            <label class={statusClass} label={status} visible={hasData} />
          </box>
          <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
            <For each={balances}>
              {(info) => (
                <box class="ds-balance-row">
                  <label class="ds-currency" label={info.currency} xalign={0} hexpand />
                  <label class="ds-total" label={info.total_balance} xalign={1} />
                </box>
              )}
            </For>
          </box>
          <label class={messageClass} label={message} visible={messageVisible} xalign={0} />
        </box>
      </popover>
    </menubutton>
  );
}
