//
//  Dynamic.swift
//  MdexApp
//
//  Created by Farooq on 11/10/2023.
//
import UIKit
import Foundation
import Lottie

@objc class Dynamic: NSObject {

  @objc func createAnimationView(rootView: UIView, lottieName: String) -> LottieAnimationView {
    let animationView = LottieAnimationView(name: lottieName)
//    animationView.frame = rootView.frame
    animationView.center = rootView.center
    animationView.frame = CGRect(x: animationView.frame.origin.x, y: animationView.frame.origin.y, width: animationView.frame.size.width, height: animationView.frame.size.height)

//    animationView.backgroundColor = UIColor.white;
    

    return animationView;
  }

  @objc func play(animationView: LottieAnimationView) {
    animationView.play(
      completion: { (success) in
        RNSplashScreen.setAnimationFinished(true)
      }
    );
  }
}

