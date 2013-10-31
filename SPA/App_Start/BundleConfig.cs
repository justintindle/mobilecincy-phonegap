using System.Web.Optimization;

namespace Tindle.MobileCincy.SPA.App_Start
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/www/js/jquery-{version}.js"));
            
            bundles.Add(new ScriptBundle("~/bundles/jquerymobile").Include(
                "~/www/js/jquery.mobile-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                "~/www/js/knockout-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").IncludeDirectory(
                "~/www/js/app", "*.js", true));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/www/css/site.css"));
            bundles.Add(new StyleBundle("~/Content/jquerymobile").Include(
                "~/www/css/jquery.mobile-{version}.css"));
        }
    }
}