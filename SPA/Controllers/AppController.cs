using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Web.Mvc;

namespace Tindle.MobileCincy.SPA.Controllers
{
    public class AppController : Controller
    {
        public ActionResult Index()
        {
            // Create index.html file for the WWW folder
            using (var stringWriter = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindView(ControllerContext, "Index", "_Layout");
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, stringWriter);

                viewResult.View.Render(viewContext, stringWriter);

                var output = stringWriter.ToString().Replace("/www/", "").Replace("cordova", "phonegap");
                var appName = Assembly.GetExecutingAssembly().GetName().CodeBase;
                var directoryName = Path.GetDirectoryName(appName);

                if (directoryName != null)
                {
                    var path = directoryName.Replace("file:\\", "");
                    var www = Directory.GetParent(path) + "\\www";
                    var filePath = www + "\\index.html";
                    var zipPath = path + "\\www.zip";

                    using (var sw = System.IO.File.CreateText(filePath))
                    {
                        sw.WriteLine(output);
                    }

                    if (System.IO.File.Exists(zipPath))
                        System.IO.File.Delete(zipPath);

                    // Zip WWW folder for deployment to PhoneGap Build
                    ZipFile.CreateFromDirectory(www, zipPath);
                }
            }

            return View();
        }
    }
}
