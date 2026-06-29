# 产品批量导入使用说明

## 1. 入口

部署后访问：

```text
https://你的域名/admin/import
```

这个页面不会出现在前台导航中，并已设置禁止搜索引擎收录。

## 2. 管理密码

在 Vercel → Project → Settings → Environment Variables 中添加：

```text
PRODUCT_IMPORT_ADMIN_TOKEN=一个足够长的随机密码
```

进入导入后台时输入相同密码。密码通过 Authorization 请求头提交，不会写进产品文件。

## 3. 支持格式

- `.csv`
- `.xlsx`
- 最大 4 MB
- Excel 只读取第一个工作表
- Excel 内嵌图片不会自动上传，图片必须使用 URL

下载模板：

```text
/downloads/product-import-template.csv
```

## 4. 重要字段

| 字段 | 是否必需 | 说明 |
|---|---:|---|
| sku | 建议 | 产品唯一货号；不填会根据 slug 自动生成 |
| slug | 建议 | 产品详情页链接；不填会根据产品名生成 |
| name | 是 | 产品名称 |
| category | 是 | 产品分类 |
| image | 是 | 主图，必须是 HTTPS 地址或 `/products/...` 路径 |
| images | 否 | 多图，使用 `|` 分隔 |
| short | 建议 | 产品短描述 |
| description | 否 | 产品完整介绍 |
| moq | 否 | 起订量 |
| lead_time | 否 | 交期 |
| materials | 否 | 使用 `|` 分隔多个值 |
| shapes | 否 | 使用 `|` 分隔多个值 |
| finishes | 否 | 使用 `|` 分隔多个值 |
| colors | 否 | 使用 `|` 分隔多个值 |
| sizes | 否 | 使用 `|` 分隔多个值 |
| featured | 否 | `yes/no`，是否首页推荐 |
| status | 否 | `published`、`draft`、`archived` |
| seo_title | 否 | SEO标题 |
| seo_description | 否 | SEO描述 |

系统同时识别常见中文列名，例如“产品名称、分类、主图、起订量、交期、材质、甲型、工艺、颜色、状态”。

## 5. 两种导入模式

### 更新并新增 Upsert

- 相同 SKU 或 slug：更新已有产品
- 新 SKU：新增产品
- 表格中没有出现的旧产品继续保留

日常更新建议使用这个模式。

### 完全替换 Replace

- 使用本次有效数据替换整个产品库
- 错误行不会写入
- 写入前自动把旧产品目录备份到：

```text
catalog/backups/products-时间.json
```

只有需要整体迁移产品库时才使用。

## 6. 产品图片

推荐先把图片批量上传到 Cloudflare R2，然后把公开 URL 填入表格：

```text
https://assets.yourdomain.com/products/PON-001/main.webp
```

本地批量上传：

```bash
npm run r2:upload
```

上传后项目根目录会生成：

```text
r2-upload-manifest.csv
```

其中包含每张图片的 R2 key 和公开地址，可以复制到产品表格。

## 7. 前台显示规则

- `published`：公开显示并进入产品 Sitemap
- `draft`：保存在产品库中，不在前台显示
- `archived`：下架保留，不在前台显示

产品导入后前台会直接读取 R2 产品目录，不需要重新提交 GitHub，也不需要重新部署 Vercel。
