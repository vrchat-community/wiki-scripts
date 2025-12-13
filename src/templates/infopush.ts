import { isWhitelistedPage } from "../whitelist";
import "./infopush.css";

if (isWhitelistedPage(["Template:MainPageInfopush", "Main_Page"])) {
  mw.loader
    .using(["oojs-ui-core", "oojs-ui-windows"])
    .done(() => {

      var windowManager = new OO.ui.WindowManager();
      $(document.body).append(windowManager.$element);

      function showArticle(element: HTMLElement) {
        var { articleTitle, articleContent } = element.dataset;

        function ArticleDialog(config: unknown) {
          ArticleDialog.super.call(this, config);
          this.config = config || {};
        }

        OO.inheritClass(ArticleDialog, OO.ui.ProcessDialog);

        ArticleDialog.static.name = "ArticleDialog";
        ArticleDialog.static.title = articleTitle;
        ArticleDialog.static.size = "large";
        ArticleDialog.static.actions = [
          {
            action: "close",
            flags: "safe",
            icon: "close",
            label: "Close"
          }
        ];

        ArticleDialog.prototype.initialize = function () {
          ArticleDialog.super.prototype.initialize.apply(this, arguments);
          this.content = new OO.ui.PanelLayout({
            $content: atob(articleContent),
            expanded: false,
            padded: true,
            scrollable: true
          });

          this.$body.append(this.content.$element);
        };

        ArticleDialog.prototype.getActionProcess = function (action: string) {
          if (action === "close") {
            return new OO.ui.Process(function () {
              this.close({ action: "close" });
            }, this);
          }
          return ArticleDialog.super.prototype.getActionProcess.call(
            this,
            action
          );
        };

        var dialog = new ArticleDialog();

        windowManager.addWindows([dialog]);
        windowManager.openWindow(dialog);
      }

      const infopushes = document.querySelectorAll(".tpl-infopush");

      for (const infopush of infopushes) {
        const content = infopush.querySelector<HTMLElement>(".tpl-infopush-content")!;

        const items = content.querySelectorAll<HTMLElement>(".tpl-infopush-item");
        const total = items.length;

        for (const item of items) {
          const { articleId } = item.dataset;
          // If we've given this item an link override, but it previously had an article, we'll ignore it.
          if (!articleId || !!item.querySelector("a")) continue;

          item.style.cursor = "pointer";
          item.addEventListener("click", () => showArticle(item));
        }

        const navigation = infopush.querySelector(".tpl-infopush-navigation")!;

        let currentOffset = 0;
        function showSlide(index: number) {
          currentOffset = (index + total) % total;
          content.style.transform = `translateX(-${currentOffset * 100}%)`;
        }

        const autoAdvanceEvery = 5000;

        let autoAdvanceInterval: number;
        function resetAutoAdvance() {
          if (autoAdvanceInterval) clearInterval(autoAdvanceInterval);
          autoAdvanceInterval = setInterval(function () {
            showSlide(currentOffset + 1);
          }, autoAdvanceEvery);
        }

        navigation
          .querySelector(".tpl-infopush-navigation-previous")!
          .addEventListener("click", () => {
            showSlide(currentOffset - 1);
            resetAutoAdvance();
          });

        navigation
          .querySelector(".tpl-infopush-navigation-next")!
          .addEventListener("click", () => {
            showSlide(currentOffset + 1);
            resetAutoAdvance();
          });

        resetAutoAdvance();
        showSlide(0);
      }
    });
}