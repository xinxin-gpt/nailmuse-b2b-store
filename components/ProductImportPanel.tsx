"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, LockKeyhole, UploadCloud, MessageSquareText } from "lucide-react";

type ImportType = "products" | "reviews";

type ImportProduct = {
  sku: string;
  slug: string;
  name: string;
  category: string;
  status: string;
};

type ImportReview = {
  sku: string;
  author: string;
  rating: number;
  comment: string;
};

type ImportRow = {
  rowNumber: number;
  product?: ImportProduct;
  review?: ImportReview;
  errors: string[];
  warnings: string[];
};

type ImportResponse = {
  ok: boolean;
  dryRun?: boolean;
  error?: string;
  mode?: string;
  summary?: {
    totalRows?: number;
    validRows?: number;
    invalidRows?: number;
    importedRows?: number;
    skippedRows?: number;
    catalogProducts?: number;
    catalogReviews?: number;
    updatedAt?: string;
    previewLimited?: boolean;
  };
  rows?: ImportRow[];
  storage?: { configured: boolean; bucket: string; catalogKey: string };
};

export function ProductImportPanel() {
  const [importType, setImportType] = useState<ImportType>("products");
  const [token, setToken] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"upsert" | "replace">("upsert");
  const [busy, setBusy] = useState<"preview" | "publish" | "">("");
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setToken(sessionStorage.getItem("nail-import-token") || "");
  }, []);

  const issueRows = useMemo(() => (result?.rows || []).filter((row) => row.errors.length || row.warnings.length), [result]);

  function changeToken(value: string) {
    setToken(value);
    sessionStorage.setItem("nail-import-token", value);
  }

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] || null);
    setResult(null);
    setMessage("");
  }

  function toggleType(type: ImportType) {
    setImportType(type);
    setFile(null);
    setResult(null);
    setMessage("");
  }

  async function runImport(dryRun: boolean) {
    if (!token.trim()) {
      setMessage("请先输入 Vercel 中配置的导入管理员密码。");
      return;
    }
    if (!file) {
      setMessage("请先选择 CSV、XLSX 或 TXT 文件。");
      return;
    }

    setBusy(dryRun ? "preview" : "publish");
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("mode", mode);
      form.append("dryRun", String(dryRun));
      
      const endpoint = importType === "products" ? "/api/admin/products/import" : "/api/admin/reviews/import";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.trim()}` },
        body: form
      });
      const payload = (await response.json()) as ImportResponse;
      setResult(payload);
      if (!response.ok || !payload.ok) throw new Error(payload.error || "导入失败");
      if (!dryRun) {
        const count = importType === "products" ? payload.summary?.catalogProducts : payload.summary?.catalogReviews;
        setMessage(`发布完成：成功导入 ${payload.summary?.importedRows || 0} 条，当前${importType === "products" ? "产品" : "评论"}库共 ${count || 0} 条。`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "导入失败");
    } finally {
      setBusy("");
    }
  }

  function submitPreview(event: FormEvent) {
    event.preventDefault();
    void runImport(true);
  }

  return (
    <div className="import-shell">
      <div className="import-tabs">
        <button className={importType === "products" ? "active" : ""} onClick={() => toggleType("products")}><FileSpreadsheet size={18} /> 产品导入</button>
        <button className={importType === "reviews" ? "active" : ""} onClick={() => toggleType("reviews")}><MessageSquareText size={18} /> 评论导入</button>
      </div>

      <form className="import-panel" onSubmit={submitPreview}>
        <div className="import-panel-head">
          <div className="admin-icon">{importType === "products" ? <FileSpreadsheet size={25} /> : <MessageSquareText size={25} />}</div>
          <div>
            <h2>批量导入{importType === "products" ? "产品" : "评论"}</h2>
            <p>支持 CSV、XLSX 和 TXT (制表符分隔)；先预检，再写入 R2 存储。</p>
          </div>
        </div>

        <label className="admin-field">
          <span><LockKeyhole size={16} /> 导入管理员密码</span>
          <input type="password" value={token} onChange={(event) => changeToken(event.target.value)} placeholder="PRODUCT_IMPORT_ADMIN_TOKEN" autoComplete="off" />
          <small>密码仅保存在当前浏览器的 sessionStorage。</small>
        </label>

        <label className="file-drop">
          <UploadCloud size={30} />
          <strong>{file ? file.name : `选择${importType === "products" ? "产品" : "评论"}文件`}</strong>
          <span>{file ? `${(file.size / 1024).toFixed(1)} KB` : "CSV / XLSX / TXT，最大 4 MB"}</span>
          <input type="file" accept=".csv,.xlsx,.txt,text/csv,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={chooseFile} />
        </label>

        <div className="import-mode">
          <label><input type="radio" checked={mode === "upsert"} onChange={() => setMode("upsert")} /><span><strong>{importType === "products" ? "更新并新增" : "追加导入"}</strong><small>{importType === "products" ? "按 SKU 或 slug 更新已有产品，其余产品保留。" : "将新评论添加到现有评论库中。"}</small></span></label>
          <label><input type="radio" checked={mode === "replace"} onChange={() => setMode("replace")} /><span><strong>完全替换</strong><small>用本次有效数据替换整个{importType === "products" ? "产品" : "评论"}库。</small></span></label>
        </div>

        <div className="admin-actions">
          <button className="button" type="submit" disabled={Boolean(busy)}>{busy === "preview" ? <Loader2 className="spin" size={17} /> : null}预检文件</button>
          {importType === "products" && <a className="button button-secondary" href="/downloads/product-import-template.csv" download>下载产品模板</a>}
        </div>
        {message ? <p className={result?.ok ? "admin-message success" : "admin-message error"}>{message}</p> : null}
      </form>

      <aside className="import-help">
        <h3>支持的格式</h3>
        <p>除了标准的 CSV 和 Excel，现在也支持 <code>.txt</code> 格式。请确保 TXT 文件使用<strong>制表符 (Tab)</strong> 分隔列。</p>
        {importType === "products" ? (
          <>
            <h3>图片如何填写</h3>
            <p>表格中的 <code>image</code> 可以填写完整 HTTPS 图片地址，也可以填写 R2 路径。</p>
          </>
        ) : (
          <>
            <h3>评论字段要求</h3>
            <p>必须包含 <code>sku</code> 和 <code>comment</code> 字段。<code>rating</code> 默认为 5，<code>author</code> 默认为 Anonymous。</p>
          </>
        )}
      </aside>

      {result?.summary ? (
        <section className="import-results">
          <div className="result-stats">
            <div><span>总行数</span><strong>{result.summary.totalRows || 0}</strong></div>
            <div><span>有效</span><strong>{result.summary.validRows ?? result.summary.importedRows ?? 0}</strong></div>
            <div><span>错误</span><strong>{result.summary.invalidRows ?? result.summary.skippedRows ?? 0}</strong></div>
            <div><span>存储</span><strong>R2</strong></div>
          </div>

          {result.dryRun ? (
            <div className="publish-bar">
              <div>{(result.summary.validRows || 0) > 0 ? <CheckCircle2 size={21} /> : <AlertTriangle size={21} />}<span>预检完成。错误行会被跳过，确认后可发布。</span></div>
              <button className="button" type="button" disabled={Boolean(busy) || !(result.summary.validRows || 0)} onClick={() => void runImport(false)}>{busy === "publish" ? <Loader2 className="spin" size={17} /> : null}确认发布</button>
            </div>
          ) : null}

          <div className="import-table-wrap">
            <table className="import-table">
              <thead>
                {importType === "products" ? (
                  <tr><th>行</th><th>SKU</th><th>产品名称</th><th>状态</th><th>检查结果</th></tr>
                ) : (
                  <tr><th>行</th><th>SKU</th><th>评价人</th><th>评分</th><th>检查结果</th></tr>
                )}
              </thead>
              <tbody>
                {(result.rows || []).map((row) => (
                  <tr key={row.rowNumber} className={row.errors.length ? "row-error" : ""}>
                    <td>{row.rowNumber}</td>
                    {importType === "products" ? (
                      <>
                        <td>{row.product?.sku || "—"}</td>
                        <td>{row.product?.name || "—"}</td>
                        <td>{row.product?.status || "—"}</td>
                      </>
                    ) : (
                      <>
                        <td>{row.review?.sku || "—"}</td>
                        <td>{row.review?.author || "—"}</td>
                        <td>{row.review?.rating || "—"}</td>
                      </>
                    )}
                    <td>{row.errors.length ? <span className="error-text">{row.errors.join("；")}</span> : row.warnings.length ? <span className="warning-text">{row.warnings.join("；")}</span> : <span className="success-text">可导入</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.summary.previewLimited ? <p className="table-note">预览仅显示前 100 行。</p> : null}
          {issueRows.length ? <p className="table-note">共发现 {issueRows.length} 行问题。</p> : null}
        </section>
      ) : null}
    </div>
  );
}
